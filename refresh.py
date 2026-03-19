#!/usr/bin/env python3
"""
Project dashboard data collector.

Usage:
  python3 refresh.py           — collect once, write data.json
  python3 refresh.py --watch   — collect every 60s until Ctrl+C
"""

import json
import re
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
WATCH_INTERVAL = 60  # seconds


# ── Config loading ─────────────────────────────────────────────────────────────

def load_projects() -> list[dict]:
    """Load project list from projects.json (next to this script)."""
    cfg_file = SCRIPT_DIR / "projects.json"
    if not cfg_file.exists():
        raise FileNotFoundError(f"projects.json not found at {cfg_file}")
    return json.loads(cfg_file.read_text(encoding="utf-8"))


def load_notes() -> dict[str, str]:
    """Load per-project notes from notes.json. Returns {} if file absent."""
    notes_file = SCRIPT_DIR / "notes.json"
    if not notes_file.exists():
        return {}
    return json.loads(notes_file.read_text(encoding="utf-8"))

# ── Git helpers ───────────────────────────────────────────────────────────────

def run(cmd: list[str], cwd: str) -> str:
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    return result.stdout.strip()


def git_info(path: str) -> dict:
    branch = run(["git", "branch", "--show-current"], path)

    # All local branches except current
    all_branches_raw = run(["git", "branch", "--format=%(refname:short)"], path)
    other_branches = [b for b in all_branches_raw.splitlines() if b and b != branch]

    # Uncommitted changes
    status_lines = run(["git", "status", "--porcelain"], path).splitlines()
    modified = untracked = staged = 0
    for line in status_lines:
        if len(line) < 2:
            continue
        x, y = line[0], line[1]
        if x == "?" and y == "?":
            untracked += 1
        else:
            if x not in (" ", "?"):
                staged += 1
            if y not in (" ", "?"):
                modified += 1

    # Ahead / behind
    ahead = behind = None
    has_upstream = False
    ab = run(["git", "rev-list", "--left-right", "--count", "@{upstream}...HEAD"], path)
    if ab:
        parts = ab.split()
        if len(parts) == 2:
            has_upstream = True
            behind, ahead = int(parts[0]), int(parts[1])

    # Unpushed diff size (lines added/removed in ahead commits)
    unpushed_stats = None
    if ahead and ahead > 0:
        stat_raw = run(["git", "diff", f"HEAD~{ahead}..HEAD", "--shortstat"], path)
        m = re.search(r"(\d+) insertion", stat_raw)
        d = re.search(r"(\d+) deletion", stat_raw)
        if m or d:
            unpushed_stats = {
                "insertions": int(m.group(1)) if m else 0,
                "deletions": int(d.group(1)) if d else 0,
            }

    # Commits
    last_commit = None
    recent_commits = []
    log_raw = run(["git", "log", "-5", "--format=%h|%aI|%s"], path)
    for i, line in enumerate(log_raw.splitlines()):
        parts = line.split("|", 2)
        if len(parts) == 3:
            commit = {"hash": parts[0], "date": parts[1], "message": parts[2]}
            if i == 0:
                last_commit = commit
            recent_commits.append(commit)

    return {
        "is_git": True,
        "branch": branch or None,
        "other_branches": other_branches,
        "modified": modified,
        "untracked": untracked,
        "staged": staged,
        "total_changes": modified + untracked + staged,
        "ahead": ahead,
        "behind": behind,
        "has_upstream": has_upstream,
        "unpushed_stats": unpushed_stats,
        "last_commit": last_commit,
        "recent_commits": recent_commits,
    }


# ── Roadmap helpers ───────────────────────────────────────────────────────────

def extract_section(text: str, section_name: str) -> str:
    """Extract content from a heading until the next same-level heading."""
    lines = text.splitlines()
    in_section = False
    result = []
    for line in lines:
        if re.match(r"^#{1,3}\s+" + re.escape(section_name), line):
            in_section = True
            continue
        if in_section:
            if re.match(r"^#{1,3}\s+", line):
                break
            result.append(line)
    return "\n".join(result)


def parse_checkboxes(text: str) -> dict:
    done_items, todo_items = [], []
    for line in text.splitlines():
        m = re.match(r"\s*-\s+\[( |x|X)\]\s+(.*)", line)
        if m:
            checked = m.group(1).lower() == "x"
            label = m.group(2).strip()
            (done_items if checked else todo_items).append(label)
    return {"done": len(done_items), "total": len(done_items) + len(todo_items), "pending": todo_items[:5]}


def parse_next_steps(text: str) -> dict:
    items = []
    for line in text.splitlines():
        m = re.match(r"\s*(?:\d+\.|[-*])\s+(.*)", line)
        if m and m.group(1).strip():
            items.append(m.group(1).strip())
    return {"done": 0, "total": len(items), "pending": items[:5]}


def parse_phase_status(text: str) -> dict:
    """Parse ✅ / ⬜ phase markers from section headings."""
    done_phases, pending_phases = [], []
    for line in text.splitlines():
        m = re.match(r"\s*#{1,4}\s+(✅|⬜)\s+(Phase\s+\S+.*)", line)
        if m:
            marker, label = m.group(1), m.group(2).strip()
            # strip trailing " — description"
            label = label.split(" — ")[0].strip()
            (done_phases if marker == "✅" else pending_phases).append(label)
    return {
        "done": len(done_phases),
        "total": len(done_phases) + len(pending_phases),
        "pending": pending_phases[:5],
    }


PARSERS = {
    "checkboxes": parse_checkboxes,
    "next_steps": parse_next_steps,
    "phase_status": parse_phase_status,
}


def load_roadmap(project_path: str, cfg: dict) -> dict | None:
    fpath = Path(project_path) / cfg["file"]
    if not fpath.exists():
        return None
    text = fpath.read_text(encoding="utf-8")
    body = extract_section(text, cfg["section"]) if cfg.get("section") else text
    if not body.strip():
        return None
    result = PARSERS[cfg.get("mode", "checkboxes")](body)
    result["source"] = cfg["file"]
    result["section"] = cfg.get("section") or "Roadmap"
    return result if result["total"] > 0 else None


# ── Project collector ─────────────────────────────────────────────────────────

def collect_project(proj: dict) -> dict:
    path = proj["path"]
    p = Path(path)
    base: dict = {
        "id": proj["id"],
        "name": proj["id"],
        "description": proj["description"],
        "tech": proj["tech"],
        "path": path,
        "exists": p.exists(),
        "roadmap": None,
    }

    if not p.exists():
        return {**base, "is_git": False}

    if (p / ".git").exists():
        base.update(git_info(path))
    else:
        base.update({
            "is_git": False, "branch": None, "other_branches": [],
            "modified": 0, "untracked": 0, "staged": 0, "total_changes": 0,
            "ahead": None, "behind": None, "has_upstream": False,
            "unpushed_stats": None, "last_commit": None, "recent_commits": [],
        })

    if proj.get("roadmap"):
        base["roadmap"] = load_roadmap(path, proj["roadmap"])

    return base


# ── Stash helper ──────────────────────────────────────────────────────────────

def git_stash_count(path: str) -> int:
    raw = run(["git", "stash", "list"], path)
    return len([l for l in raw.splitlines() if l.strip()]) if raw else 0


# ── Sorting ───────────────────────────────────────────────────────────────────

def sort_key(p: dict):
    changes = p.get("total_changes", 0)
    last = p.get("last_commit")
    days_ago = 9999
    if last and last.get("date"):
        try:
            dt = datetime.fromisoformat(last["date"])
            days_ago = (datetime.now(timezone.utc) - dt).days
        except Exception:
            pass
    return (-changes, days_ago)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    project_defs = load_projects()
    notes = load_notes()

    projects = []
    for p in project_defs:
        collected = collect_project(p)
        collected["note"] = notes.get(p["id"])       # None if absent
        collected["archived"] = bool(p.get("archived", False))
        if collected.get("is_git"):
            collected["stash_count"] = git_stash_count(p["path"])
        else:
            collected["stash_count"] = 0
        projects.append(collected)

    projects.sort(key=sort_key)

    data = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "projects": projects,
    }

    outfile = SCRIPT_DIR / "data.json"
    outfile.write_text(json.dumps(data, ensure_ascii=False, indent=2))
    print(f"[{datetime.now().strftime('%H:%M:%S')}] data.json updated")


if __name__ == "__main__":
    if "--watch" in sys.argv:
        print(f"Watch mode — refreshing every {WATCH_INTERVAL}s (Ctrl+C to stop)")
        while True:
            try:
                main()
                time.sleep(WATCH_INTERVAL)
            except KeyboardInterrupt:
                print("\nStopped.")
                break
    else:
        main()

# DD

Local-first project dashboard for tracking the state of multiple repositories in one browser tab.

DD collects git status, roadmap progress, and per-project notes, then renders everything in a static HTML/CSS/JS dashboard served by a tiny local Python server.

## Scope

- Local-only by design
- No build step
- No remote sync or multi-user mode
- Roadmap files are opened by the local DD server on your machine

## Quick Start

```sh
uv sync --dev
cp projects.example.json projects.json
uv run python serve.py --port 8787
```

Then open [http://127.0.0.1:8787](http://127.0.0.1:8787).

The tracked example config starts empty on purpose, so a fresh public checkout will open into an empty dashboard until you add your own projects.

If you only want to regenerate `data.json`:

```sh
uv run python refresh.py
```

If you want periodic refreshes without running the server endpoint:

```sh
uv run python refresh.py --watch
```

## Configuration

`projects.json` is the active local registry. It is intentionally ignored by git in the public repo.

Example project entry:

```json
{
  "id": "my-project",
  "description": "Short card description",
  "tech": ["Python", "FastAPI"],
  "path": "/absolute/path/to/project",
  "work": true,
  "project_state": "active",
  "project_type": "client",
  "pinned": false,
  "archived": false,
  "roadmap": {
    "file": "ROADMAP.md",
    "section": "Next Steps",
    "mode": "checkboxes"
  }
}
```

Supported roadmap modes:

- `checkboxes`: parses `- [ ]` and `- [x]`
- `next_steps`: parses ordered or unordered list items
- `phase_status`: parses headings marked with `✅` or `⬜`

`notes.json` is optional. If you want a tracked local seed file for notes, copy `notes.example.json` to `notes.json`. Browser edits still live in `localStorage`.

Optional project fields:

- `project_state`: `active`, `paused`, `blocked`, `waiting`, or `maintenance`
- `project_type`: freeform category such as `client`, `job`, `personal`, `infra`, `experiment`
- `pinned`: keeps a project near the top even when git activity is quiet
- `stale_days`: custom stale threshold for that project

Saved view behavior:

- `Personal` includes projects explicitly marked with `"project_type": "personal"`
- If `project_type` is not set, `Personal` also includes projects where `"work"` is not `true`

## Features

- Git overview: branch, upstream status, ahead/behind, stash count, and working tree changes
- Roadmap parsing: progress bar plus a compact pending preview
- Notes: inline editable notes with checkbox support
- Manual project framing: state, type, and pinning
- Automatic prioritization: important projects rise toward the top by default, and `pinned` keeps manual priorities visible
- Local project controls: each card can be pinned and given a local state override in the UI, stored in browser localStorage
- Filters and views: saved views, status filters, top tech tags, text search, archive section
- Localization: English and Russian UI with browser-based default and manual toggle
- Local refresh: `POST /refresh` plus manual refresh button and keyboard shortcut
- Local desktop handoff: folder and roadmap actions run through local server endpoints

## Files

- `projects.example.json`: tracked example config
- `notes.example.json`: tracked example notes seed
- `refresh.py`: collector that produces `data.json`
- `serve.py`: local server with `POST /refresh` plus desktop handoff endpoints
- `index.html`, `styles.css`, `app.js`: static UI
- `tests/`: collector and smoke tests

## Development

Run the local checks:

```sh
uv run python -m unittest tests.test_refresh
node --test tests/test_dashboard_smoke.mjs
uv run ruff check refresh.py serve.py tests
```

## AI Agent Prompts

Ready-made prompts for adding projects and configuring the dashboard with an AI coding assistant (Claude Code, Cursor, Copilot, etc.).

---

### Add a single project

```
I have a project at <PATH>.

Look at the directory: read the README, package.json / pyproject.toml / Cargo.toml /
go.mod (whichever exists), and list any markdown files in the root that look like a
roadmap or status file (ROADMAP.md, STATUS.md, TODO.md, PLAN.md, etc.).

Then open the repository's `projects.json` and append a new entry with:
- "id": short slug based on the directory name
- "description": one sentence from the README
- "tech": array of main languages and frameworks from the dependency file
- "path": absolute path to the project
- "work": true if it looks like a client or employer project, false otherwise
- "roadmap": object if a roadmap file exists — pick the most appropriate mode:
    "checkboxes"   for files with - [ ] / - [x] items
    "next_steps"   for plain numbered or bulleted lists
    "phase_status" for headings marked with ✅ / ⬜

Do not guess — only set "roadmap" if you actually found a suitable file.
Show me the final JSON entry before writing.
```

---

### Scan a directory and add all git repos

```
Scan <PARENT_DIR> for immediate subdirectories that contain a .git folder.
For each one:
1. Read any README, package.json / pyproject.toml / Cargo.toml / go.mod present.
2. Check for a roadmap file (ROADMAP.md, STATUS.md, TODO.md, PLAN.md, CHANGELOG.md).
3. Build a projects.json entry as described below.

Entry fields:
- "id": directory name, lowercased, spaces → hyphens
- "description": one sentence from the README, or the repo name if no README
- "tech": main languages/frameworks from dependency files; fall back to file
  extensions if no manifest found
- "path": absolute path
- "work": true only if the README or package name clearly indicates a client project
- "roadmap": only if a suitable file was found (modes: checkboxes / next_steps /
  phase_status — pick based on actual file content)

Open the repository's `projects.json` and append the new entries, skipping any
project whose "id" already exists. Show a summary table before writing.
```

---

### Configure roadmap for an existing entry

```
The project "<ID>" is already in the repository's `projects.json` but has no
"roadmap" configured.

Look at the project path listed for that entry. Find any markdown file that describes
planned or remaining work (ROADMAP.md, STATUS.md, TODO.md, PLAN.md, or similar).

Read the file and choose the best parsing mode:
- "checkboxes"   — file uses - [ ] / - [x] items
- "next_steps"   — file has a numbered or bulleted list of steps
- "phase_status" — file has headings marked with ✅ or ⬜

If there is a specific heading that contains the relevant section (e.g. "## Next Steps"),
set "section" to that heading text. If the whole file is relevant, set "section" to null.

Update the entry in projects.json with the "roadmap" object. Show the diff before saving.
```

---

### Full first-time setup

```
Set up the DD dashboard in this repository for my local projects.

1. If projects.json does not exist, copy projects.example.json to projects.json.
2. Scan the following directories for git repos: <DIR_1>, <DIR_2>, ...
   (or ask me which directories to scan if none are listed)
3. For each repo found, read README + dependency manifest + any roadmap-like file.
4. Build projects.json entries (id, description, tech, path, work, roadmap).
5. Write the final projects.json.
6. Run `uv run python refresh.py` from the DD repository root
   and confirm `data.json` was updated.

Ask me before writing anything. Show the full proposed projects.json first.
```

## Troubleshooting

- If `projects.json` is missing, copy `projects.example.json` to `projects.json` and add your local project paths.
- If you want a seed notes file, copy `notes.example.json` to `notes.json`; otherwise you can skip it.
- If refresh does not work from the page, make sure the dashboard is running through `serve.py`, not a generic static server.
- If roadmap opening does not work, make sure the dashboard is running through `serve.py` and that the configured roadmap path points to a real local file.
- If the favicon does not update immediately, force-refresh the tab because browsers cache favicons aggressively.

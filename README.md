# DD

Local-first project dashboard for tracking the state of multiple repositories in one browser tab.

DD collects git status, roadmap progress, and per-project notes, then renders everything in a static HTML/CSS/JS dashboard served by a tiny local Python server.

## Scope

- Local-only by design
- No build step
- No remote sync or multi-user mode
- Roadmap files can be opened via the local filesystem (`file://`)

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

## Features

- Git overview: branch, upstream status, ahead/behind, stash count, working tree changes, recent commits
- Roadmap parsing: progress bar plus up to five pending items
- Notes: inline editable notes with checkbox support
- Filters: status filters, top tech tags, text search, archive section
- Localization: English and Russian UI with browser-based default and manual toggle
- Local refresh: `POST /refresh` plus manual refresh button and keyboard shortcut

## Files

- `projects.example.json`: tracked example config
- `notes.example.json`: tracked example notes seed
- `refresh.py`: collector that produces `data.json`
- `serve.py`: local server with `POST /refresh`
- `index.html`, `styles.css`, `app.js`: static UI
- `tests/`: collector and smoke tests

## Development

Run the local checks:

```sh
uv run python -m unittest tests.test_refresh
node --test tests/test_dashboard_smoke.mjs
uv run ruff check refresh.py serve.py tests
```

## Troubleshooting

- If `projects.json` is missing, copy `projects.example.json` to `projects.json` and add your local project paths.
- If you want a seed notes file, copy `notes.example.json` to `notes.json`; otherwise you can skip it.
- If refresh does not work from the page, make sure the dashboard is running through `serve.py`, not a generic static server.
- If the favicon does not update immediately, force-refresh the tab because browsers cache favicons aggressively.
- If a roadmap button opens nothing, confirm your browser allows opening local `file://` URLs from a local page.

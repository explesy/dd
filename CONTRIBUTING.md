# Contributing

DD is a local-only tool. Changes should preserve that scope unless a maintainer explicitly decides otherwise.

## Local Setup

```sh
uv sync --dev
cp projects.example.json projects.json
```

Add your own local repositories to `projects.json`.
Copy `notes.example.json` to `notes.json` only if you want a local seed file for notes.

## Checks

```sh
uv run python -m unittest tests.test_refresh
node --test tests/test_dashboard_smoke.mjs
uv run ruff check refresh.py serve.py tests
```

## Notes

- Do not commit personal `projects.json`, `notes.json`, or generated `data.json`.
- Keep the app local-first and no-build.
- Keep English and Russian UI strings in sync when changing user-facing text.

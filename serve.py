#!/usr/bin/env python3
"""
Local dashboard server with built-in refresh endpoint.

Usage:
  python3 serve.py
  python3 serve.py --port 8787 --bind 127.0.0.1
"""

import argparse
import json
import os
import subprocess
import sys
import threading
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import refresh

REFRESH_LOCK = threading.Lock()
LAST_REFRESH_ERROR = None
DATA_FILE = refresh.SCRIPT_DIR / "data.json"


def run_refresh() -> dict:
    global LAST_REFRESH_ERROR
    try:
        data = refresh.main()
    except Exception as exc:
        LAST_REFRESH_ERROR = str(exc)
        DATA_FILE.unlink(missing_ok=True)
        raise
    LAST_REFRESH_ERROR = None
    return data


def read_json_body(handler: SimpleHTTPRequestHandler) -> dict:
    length = int(handler.headers.get("Content-Length", "0") or "0")
    raw = handler.rfile.read(length) if length > 0 else b""
    if not raw:
        return {}
    return json.loads(raw.decode("utf-8"))


def open_path_in_os(target: Path) -> None:
    if sys.platform == "darwin":
        subprocess.Popen(["open", str(target)])
        return
    if sys.platform.startswith("win"):
        os.startfile(str(target))  # type: ignore[attr-defined]
        return
    subprocess.Popen(["xdg-open", str(target)])


class DashboardHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def _send_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def end_headers(self) -> None:
        if self.path.startswith("/data.json"):
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self) -> None:
        if self.path.startswith("/data.json") and LAST_REFRESH_ERROR and not DATA_FILE.exists():
            self._send_json(
                HTTPStatus.INTERNAL_SERVER_ERROR,
                {"ok": False, "error": LAST_REFRESH_ERROR},
            )
            return
        super().do_GET()

    def do_POST(self) -> None:
        if self.path == "/refresh":
            with REFRESH_LOCK:
                try:
                    data = run_refresh()
                except Exception as exc:  # pragma: no cover - exercised via smoke test
                    self._send_json(
                        HTTPStatus.INTERNAL_SERVER_ERROR,
                        {"ok": False, "error": str(exc)},
                    )
                    return

            self._send_json(HTTPStatus.OK, {"ok": True, "data": data})
            return

        if self.path == "/open-roadmap":
            try:
                payload = read_json_body(self)
            except json.JSONDecodeError:
                self._send_json(
                    HTTPStatus.BAD_REQUEST,
                    {"ok": False, "error": "Invalid JSON body"},
                )
                return

            target = Path(str(payload.get("path") or "")).expanduser()
            if not target.is_file():
                self._send_json(
                    HTTPStatus.BAD_REQUEST,
                    {"ok": False, "error": "Roadmap path does not point to an existing file"},
                )
                return

            try:
                open_path_in_os(target)
            except Exception as exc:
                self._send_json(
                    HTTPStatus.INTERNAL_SERVER_ERROR,
                    {"ok": False, "error": f"Could not open roadmap: {exc}"},
                )
                return

            self._send_json(HTTPStatus.OK, {"ok": True})
            return

        if self.path != "/refresh":
            self._send_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "Not found"})
            return
        self._send_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "Not found"})


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve DD dashboard locally")
    parser.add_argument("--bind", default="127.0.0.1", help="Address to bind to")
    parser.add_argument("--port", type=int, default=8787, help="Port to listen on")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    try:
        run_refresh()
    except Exception as exc:
        print(f"Startup refresh failed: {exc}")
    handler = partial(DashboardHandler, directory=str(refresh.SCRIPT_DIR))
    server = ThreadingHTTPServer((args.bind, args.port), handler)
    host = args.bind
    print(f"Serving DD dashboard on http://{host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

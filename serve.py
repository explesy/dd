#!/usr/bin/env python3
"""
Local dashboard server with built-in refresh endpoint.

Usage:
  python3 serve.py
  python3 serve.py --port 8787 --bind 127.0.0.1
"""

import argparse
import json
import threading
from functools import partial
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

import refresh

REFRESH_LOCK = threading.Lock()


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

    def do_POST(self) -> None:
        if self.path != "/refresh":
            self._send_json(HTTPStatus.NOT_FOUND, {"ok": False, "error": "Not found"})
            return

        with REFRESH_LOCK:
            try:
                data = refresh.main()
            except Exception as exc:  # pragma: no cover - exercised via smoke test
                self._send_json(
                    HTTPStatus.INTERNAL_SERVER_ERROR,
                    {"ok": False, "error": str(exc)},
                )
                return

        self._send_json(HTTPStatus.OK, {"ok": True, "data": data})


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve DD dashboard locally")
    parser.add_argument("--bind", default="127.0.0.1", help="Address to bind to")
    parser.add_argument("--port", type=int, default=8787, help="Port to listen on")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    refresh.main()
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

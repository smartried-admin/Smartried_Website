from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote
import argparse
import os


ROUTE_MAP = {
    "/favicon.ico": "/img/favicon.png",
    "/": "/index.html",
    "/home": "/index.html",
    "/programs": "/programs.html",
    "/about": "/about.html",
    "/contact": "/contact.html",
    "/privacy-policy": "/privacy-policy.html",
    "/terms-of-use": "/terms-of-use.html",
    "/course-java": "/course-java.html",
    "/course-python": "/course-python.html",
    "/course-data-engineering": "/course-data-engineering.html",
    "/course-devops": "/course-devops.html",
    "/course-automation": "/course-automation.html",
    "/service-training": "/service-training.html",
    "/service-placement": "/service-placement.html",
    "/service-outsourcing": "/service-outsourcing.html",
}


class RewritingHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlsplit(self.path)
        path = unquote(parsed.path or "/")
        normalized = path.rstrip("/") or "/"

        if normalized in ROUTE_MAP:
            self.path = ROUTE_MAP[normalized]
        elif not Path(normalized).suffix:
            # Match production behavior where unknown clean paths land on home.
            self.path = "/index.html"

        return super().do_GET()


def main():
    parser = argparse.ArgumentParser(description="Run local dev server with clean URL rewrites")
    parser.add_argument("--port", type=int, default=5500, help="Port to listen on")
    args = parser.parse_args()

    base_dir = Path(__file__).resolve().parent
    os.chdir(base_dir)

    server = ThreadingHTTPServer(("127.0.0.1", args.port), RewritingHandler)
    print(f"Serving {base_dir} at http://127.0.0.1:{args.port}")
    print("Clean URL rewrites are enabled.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

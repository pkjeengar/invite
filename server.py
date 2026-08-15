#!/usr/bin/env python3
"""Static server + admin publish endpoint for the wedding invitation site.

Replaces `python -m http.server`. Serves the template folder and lets the
admin page publish generated client folders from a zip:

    POST /api/publish   body = zip (index.html + runtime .mjs files)
                        -> extracted to client-<slug>/ under the served folder
                        -> 200 {"url": "/client-<slug>/index.html"}

Run:
    python server.py [port]        (default port 8000)
"""
import io
import json
import os
import re
import sys
import zipfile
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
SLUG_RE = re.compile(r'^[a-z0-9][a-z0-9_-]{0,39}$', re.I)
ALLOWED_FILES = {'index.html'}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=HERE, **kwargs)

    def do_GET(self):
        if self.path == '/api/log':
            log_path = os.path.join(HERE, 'server_log.json')
            if os.path.exists(log_path):
                with open(log_path, 'r', encoding='utf-8') as f:
                    body = f.read().encode('utf-8')
            else:
                body = b'{"entries":[]}'
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/log':
            length = int(self.headers.get('Content-Length', 0) or 0)
            data = self.rfile.read(length)
            with open(os.path.join(HERE, 'server_log.json'), 'w', encoding='utf-8') as f:
                f.write(data.decode('utf-8', 'replace'))
            self._json(200, {'ok': True})
            return
        if self.path != '/api/publish':
            self.send_error(404)
            return
        length = int(self.headers.get('Content-Length', 0) or 0)
        if length <= 0 or length > 100 * 1024 * 1024:
            self._json(400, {'error': 'bad request body'})
            return
        data = self.rfile.read(length)
        slug = self.headers.get('X-Client-Slug', '')
        if not SLUG_RE.match(slug):
            self._json(400, {'error': 'invalid client slug'})
            return
        try:
            zf = zipfile.ZipFile(io.BytesIO(data))
        except Exception as e:
            self._json(400, {'error': 'invalid zip: %s' % e})
            return
        target = os.path.join(HERE, 'client-' + slug)
        try:
            os.makedirs(target, exist_ok=True)
            names = zf.namelist()
            for name in names:
                # sanitize: no absolute paths, no parent traversal
                norm = name.replace('\\', '/')
                if norm.startswith('/') or '..' in norm.split('/'):
                    self._json(400, {'error': 'unsafe zip entry: %s' % name})
                    return
                basename = os.path.basename(norm)
                if not basename:
                    continue
                if norm not in ('index.html',) and not norm.endswith('.mjs'):
                    continue
                dest = os.path.join(target, basename)
                with open(dest, 'wb') as f:
                    f.write(zf.read(name))
        except Exception as e:
            self._json(500, {'error': 'extract failed: %s' % e})
            return
        self._json(200, {'url': '/client-%s/index.html' % slug})

    def _json(self, code, payload):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        sys.stderr.write('[server] %s\n' % (fmt % args))


def main():
    port = 8000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    server = ThreadingHTTPServer(('0.0.0.0', port), Handler)
    print('Serving %s on http://localhost:%s (admin: http://localhost:%s/admin.html)' % (HERE, port, port))
    server.serve_forever()


if __name__ == '__main__':
    main()

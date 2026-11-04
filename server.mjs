import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import handler from './dist/game-handler.mjs';

const root = resolve('public');
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    if (url.pathname === '/health') { res.writeHead(200, { 'content-type': 'application/json' }); res.end('{"ok":true}'); return; }
    if (url.pathname === '/api/game') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const request = new Request(url, { method: req.method, headers: { 'content-type': req.headers['content-type'] || 'application/json' }, ...(req.method === 'GET' || req.method === 'HEAD' ? {} : { body }) });
      const response = await handler(request);
      res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
      res.end(await response.text());
      return;
    }
    const requested = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const path = resolve(root, requested);
    if (!path.startsWith(root)) { res.writeHead(403); res.end('Forbidden'); return; }
    let data;
    try { data = await readFile(path); } catch { data = await readFile(resolve(root, 'index.html')); }
    res.writeHead(200, { 'content-type': mime[extname(path)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(data);
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'content-type': 'text/plain' }); res.end('Server error');
  }
});
const port = Number(process.env.PORT || 3000);
server.listen(port, '0.0.0.0', () => console.log(`THE PERFECT SUSPECT listening on ${port}`));

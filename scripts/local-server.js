const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 8888;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
};

function resolveRoute(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].replace(/\/+$/, '') || '/');

  if (clean.startsWith('/blog/') && clean !== '/blog') {
    return '/blog/post.html';
  }
  if (clean === '/blog') return '/blog/index.html';
  if (clean.startsWith('/compare/') && clean !== '/compare') {
    const slug = clean.slice('/compare/'.length);
    const file = path.join(ROOT, 'compare', slug, 'index.html');
    if (fs.existsSync(file)) return `/compare/${slug}/index.html`;
  }
  if (clean === '/compare') return '/compare/index.html';

  const direct = clean === '/' ? '/index.html' : clean;
  const filePath = path.join(ROOT, direct);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return direct;

  const withIndex = path.join(ROOT, clean, 'index.html');
  if (fs.existsSync(withIndex)) return `${clean}/index.html`.replace(/\\/g, '/');

  return null;
}

const server = http.createServer((req, res) => {
  const route = resolveRoute(req.url);
  if (!route) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }
  const filePath = path.join(ROOT, route);
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Local server: http://localhost:${PORT}`);
});

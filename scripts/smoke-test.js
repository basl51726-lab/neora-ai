const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 8890;

function resolveRoute(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].replace(/\/+$/, '') || '/');
  if (clean.startsWith('/blog/') && clean !== '/blog') return '/blog/post.html';
  if (clean === '/blog') return '/blog/index.html';
  if (clean.startsWith('/tools/') && clean !== '/tools') return '/tool/detail.html';
  if (clean === '/tools' || clean === '/tool') return '/tool/index.html';
  if (clean.startsWith('/compare/') && clean !== '/compare') {
    const slug = clean.slice('/compare/'.length);
    if (fs.existsSync(path.join(ROOT, 'compare', slug, 'index.html'))) {
      return `/compare/${slug}/index.html`;
    }
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
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  fs.readFile(path.join(ROOT, route), (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
});

const PAGES = [
  ['Homepage', '/'],
  ['Blog index', '/blog/'],
  ['Blog post', '/blog/2026-06-14-اعتمدت-على-chatgpt-في-عملي-اليومي-لمدة-شهر-كامل-هذه-النتائج-التي-فاجأتني'],
  ['Tools listing', '/tools/'],
  ['Tool detail', '/tools/chatgpt'],
  ['Compare hub', '/compare/'],
  ['Compare detail (card)', '/compare/chatgpt-vs-claude/'],
  ['Compare detail (hero)', '/compare/chatgpt-vs-grok/'],
  ['About', '/about/'],
  ['Contact', '/contact/'],
  ['Privacy', '/privacy-policy/'],
  ['Terms', '/terms/'],
];

function get(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${urlPath}`, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

function checkDesign(body) {
  const checks = {
    homepageCss: body.includes('homepage.css'),
    pagesCssOrHomeOnly: body.includes('pages.css') || body.includes('index.html'),
    noMainCss: !body.includes('main.css'),
    neoraNav: body.includes('class="logo"') && body.includes('NEORA'),
    noOldLogo: !body.includes('lmark'),
    noSiteJs: !body.includes('site.js'),
    homepageJs: body.includes('homepage.js'),
    cairoFont: body.includes('family=Cairo'),
  };
  return checks;
}

server.listen(PORT, async () => {
  let failed = false;
  for (const [name, urlPath] of PAGES) {
    try {
      const { status, body } = await get(urlPath);
      const checks = checkDesign(body);
      const needsPages = urlPath !== '/';
      const designOk = checks.homepageCss && checks.noMainCss && checks.neoraNav && checks.noOldLogo && checks.homepageJs && checks.cairoFont && (!needsPages || body.includes('pages.css'));
      const ok = status === 200 && body.includes('<html') && designOk;
      console.log(`${ok ? 'PASS' : 'FAIL'} ${name} (${urlPath}) HTTP ${status}`);
      if (!ok) {
        failed = true;
        console.log('  checks:', checks);
      }
    } catch (e) {
      console.log(`FAIL ${name} (${urlPath})`, e.message);
      failed = true;
    }
  }
  server.close();
  process.exit(failed ? 1 : 0);
});

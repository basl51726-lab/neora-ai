const http = require('http');

const PAGES = [
  {
    name: 'blog post',
    path: '/blog/2026-06-14-اعتمدت-على-chatgpt-في-عملي-اليومي-لمدة-شهر-كامل-هذه-النتائج-التي-فاجأتني',
    mustHave: [
      'content-pages.css',
      'blog-post-page',
      'class="nav"',
      'class="footer"',
      'main.css',
      'site.js',
    ],
    mustNotHave: [
      '<style>',
      '#fbfaf6',
      '#fffdf5',
      '#d4af37',
      '#b8962e',
      '#3d2800',
      '#6b4a00',
    ],
  },
  {
    name: 'compare chatgpt-vs-grok',
    path: '/compare/chatgpt-vs-grok/',
    mustHave: [
      'content-pages.css',
      'compare-detail',
      'compare-page-layout',
      'class="nav"',
      'class="footer"',
      'main.css',
      'site.js',
    ],
    mustNotHave: [
      '<style>',
      '```html',
      '#fbfaf6',
      '#fffdf5',
      '#d4af37',
      '<header>\n  <a class="logo" href="/">NEORA</a>',
    ],
  },
];

function fetch(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:8888${path}`, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
}

(async () => {
  let failed = false;

  for (const page of PAGES) {
    console.log(`\n=== ${page.name} ===`);
    const { status, body } = await fetch(page.path);
    console.log(`HTTP ${status}`);

    if (status !== 200) {
      console.log('FAIL: non-200 status');
      failed = true;
      continue;
    }

    for (const token of page.mustHave) {
      if (!body.includes(token)) {
        console.log(`FAIL: missing "${token}"`);
        failed = true;
      } else {
        console.log(`OK: has "${token}"`);
      }
    }

    for (const token of page.mustNotHave) {
      if (body.includes(token)) {
        console.log(`FAIL: still has old marker "${token}"`);
        failed = true;
      }
    }
  }

  process.exit(failed ? 1 : 0);
})();

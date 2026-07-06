/**
 * Applies homepage design system to all inner public pages.
 * Run: node scripts/apply-neora-design.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const NAV = `  <nav class="nav" role="navigation" aria-label="التنقل الرئيسي">
    <div class="nav-inner">
      <a href="/" class="logo" aria-label="الصفحة الرئيسية NEORA">NEORA</a>

      <button class="nav-mobile-toggle" aria-label="فتح القائمة" aria-expanded="false" aria-controls="nav-menu">
        <span></span><span></span><span></span>
      </button>

      <ul class="nav-links" id="nav-menu" role="list">
        <li><a href="/tool/">الأدوات</a></li>
        <li><a href="/#categories-heading">التصنيفات</a></li>
        <li><a href="/compare/">المقارنات</a></li>
        <li><a href="/blog/">المدونة</a></li>
        <li><a href="/about/">من نحن</a></li>
      </ul>

      <div class="nav-r">
        <a href="/tool/" class="nc">استكشف الأدوات
          <svg viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </div>
  </nav>`;

const FOOTER = `  <footer class="footer" role="contentinfo">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="/" class="logo footer-logo" aria-label="الصفحة الرئيسية NEORA">NEORA</a>
        <p class="footer-desc">دليل عملي ومتجدد لأدوات الذكاء الاصطناعي في جميع المجالات.</p>
      </div>
      <nav class="footer-cols" aria-label="روابط الفوتر">
        <div class="footer-col">
          <h3 class="fcol-title">روابط سريعة</h3>
          <a href="/">الصفحة الرئيسية</a>
          <a href="/tool/">الأدوات</a>
          <a href="/compare/">المقارنات</a>
          <a href="/blog/">المدونة</a>
        </div>
        <div class="footer-col">
          <h3 class="fcol-title">الدعم</h3>
          <a href="/about/">من نحن</a>
          <a href="/contact/">تواصل معنا</a>
          <a href="/privacy-policy/">سياسة الخصوصية</a>
          <a href="/terms/">شروط الاستخدام</a>
        </div>
        <div class="footer-col">
          <h3 class="fcol-title">تابعنا</h3>
          <a href="https://linkedin.com/in/yzneora" rel="noopener noreferrer" target="_blank">LinkedIn</a>
          <a href="mailto:hello@neora-ai.com">hello@neora-ai.com</a>
        </div>
      </nav>
    </div>
    <div class="footer-bottom">
      <p class="fcopy">© <span id="footer-year">2026</span> NEORA. جميع الحقوق محفوظة.</p>
    </div>
  </footer>`;

const FAVICON = `<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%233b82f6%22/><text x=%2250%22 y=%2268%22 font-size=%2260%22 font-family=%22Arial%22 font-weight=%22900%22 fill=%22white%22 text-anchor=%22middle%22>N</text></svg>">`;

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Space+Mono:wght@700&display=swap" rel="stylesheet">`;

const STYLES = `<link rel="stylesheet" href="/assets/css/homepage.css?v=5">
<link rel="stylesheet" href="/assets/css/pages.css?v=1">`;

const SCRIPT = `<script src="/assets/js/homepage.js?v=4" defer></script>`;

const SEARCH_SVG = `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.8"/><path d="M15 15L13 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

function collectTargets() {
  const files = [];
  const add = (rel) => {
    if (fs.existsSync(path.join(ROOT, rel))) files.push(rel);
  };

  [
    'about/index.html',
    'contact/index.html',
    'privacy-policy/index.html',
    'terms/index.html',
    'blog/index.html',
    'blog/post.html',
    'compare/index.html',
    'tool/index.html',
    'tool/detail.html',
  ].forEach(add);

  if (fs.existsSync(path.join(ROOT, 'compare'))) {
    fs.readdirSync(path.join(ROOT, 'compare')).forEach((d) => {
      add(`compare/${d}/index.html`);
    });
  }

  return [...new Set(files)].filter((f) => !f.includes('admin'));
}

function stripOldNav(html) {
  return html.replace(/^\s*<nav[^>]*>[\s\S]*?<\/nav>\s*/im, '');
}

function stripOldFooter(html) {
  return html.replace(/\s*<footer[\s\S]*?<\/footer>\s*/i, '');
}

function stripOldAssets(html) {
  return html
    .replace(/<link[^>]*main\.css[^>]*>\s*/gi, '')
    .replace(/<link[^>]*content-pages\.css[^>]*>\s*/gi, '')
    .replace(/<link[^>]*blog-listing\.css[^>]*>\s*/gi, '')
    .replace(/<link[^>]*fonts\.googleapis\.com[^>]*Inter[^>]*>\s*/gi, '')
    .replace(/<link[^>]*family=Inter[^>]*>\s*/gi, '')
    .replace(/<link rel="icon" type="image\/svg\+xml" href="\/images\/favicon\.svg">\s*/gi, '')
    .replace(/<link rel="preconnect"[^>]*>\s*/gi, '')
    .replace(/<script[^>]*site\.js[^>]*><\/script>\s*/gi, '');
}

function injectHead(html) {
  let out = stripOldAssets(html);
  if (!out.includes('homepage.css')) {
    out = out.replace('</head>', `  ${FAVICON}\n  ${FONTS}\n  ${STYLES}\n</head>`);
  } else {
    out = out.replace(/homepage\.css\?v=\d+/g, 'homepage.css?v=5');
    if (!out.includes('pages.css')) {
      out = out.replace('</head>', `  ${STYLES.split('\n')[1]}\n</head>`);
    }
    out = out.replace(/blog-listing\.css[^>]*>\s*/gi, '');
  }
  return out;
}

function addSitePageClass(html) {
  return html.replace(/<body([^>]*)>/i, (m, attrs) => {
    if (/class="/.test(attrs)) {
      if (/site-page/.test(attrs)) return m;
      return `<body${attrs.replace(/class="([^"]*)"/, 'class="$1 site-page"')}>`;
    }
    return `<body class="site-page"${attrs}>`;
  });
}

function transformListingHero(html) {
  return html.replace(
    /<header class="inner-hero">\s*<div class="page-badge">([\s\S]*?)<\/div>\s*<h1>([\s\S]*?)<\/h1>\s*<p>([\s\S]*?)<\/p>\s*<\/header>/i,
    (_, badge, h1, p) => `<header class="page-hero-bar" aria-labelledby="page-heading">
    <div class="hbadge"><span class="hbdot" aria-hidden="true"></span>${badge.trim()}</div>
    <h1 class="hero-h" id="page-heading">${h1.trim()}</h1>
    <p class="hero-p">${p.trim()}</p>
  </header>`
  );
}

function transformControls(html) {
  let out = html.replace(
    /<div class="controls">\s*<div class="search-wrap">\s*<input([^>]*id="searchInput"[^>]*)>\s*<button class="search-btn"([^>]*)>([\s\S]*?)<\/button>\s*<\/div>\s*<div class="filters">([\s\S]*?)<\/div>\s*<\/div>/i,
    (_, inputAttrs, btnAttrs, btnText, filters) => {
      const ppFilters = filters
        .replace(/class="filter-btn/g, 'class="pp')
        .replace(/filter-btn active/g, 'pp active');
      return `<div class="page-controls">
  <div class="search-area" role="search">
    <div class="sbar">
      ${SEARCH_SVG}
      <input${inputAttrs}>
      <button type="button" class="sbtn"${btnAttrs}>${btnText.trim()}</button>
    </div>
  </div>
  <div class="page-filters" role="group" aria-label="تصفية">
    ${ppFilters.trim()}
  </div>
</div>`;
    }
  );

  out = out.replace(
    /document\.querySelectorAll\('\.filter-btn'\)/g,
    "document.querySelectorAll('.pp')"
  );

  return out;
}

function transformListingSection(html) {
  return html
    .replace(/class="tools-count"/g, 'class="listing-count"')
    .replace(/class="grid grid-tools"/g, 'class="grid grid-tools listing-sec"')
    .replace(/class="container tools-listing"/g, 'class="container listing-sec"')
    .replace(/class="container compare-hub"/g, 'class="container listing-sec"')
    .replace(/class="grid compare-hub-grid"/g, 'class="grid compare-hub-grid listing-sec"');
}

function ensureReadingProgress(html) {
  if (html.includes('reading-progress')) return html;
  if (!html.includes('blog-post-page') && !html.includes('compare-detail')) return html;
  return html.replace(/<body[^>]*>\s*\n/, (m) => m + '\n<div id="reading-progress"></div>\n');
}

function injectChrome(html) {
  let out = html;
  out = stripOldNav(out);
  out = stripOldFooter(out);
  out = injectHead(out);
  out = addSitePageClass(out);
  out = transformListingHero(out);
  out = transformControls(out);
  out = transformListingSection(out);
  out = ensureReadingProgress(out);

  out = out.replace(/<body([^>]*)>/i, (m) => m + '\n\n' + NAV + '\n');

  if (!out.includes('class="footer"')) {
    out = out.replace(/<\/body>/i, '\n' + FOOTER + '\n' + SCRIPT + '\n</body>');
  } else if (!out.includes('homepage.js')) {
    out = out.replace(/<\/body>/i, '\n' + SCRIPT + '\n</body>');
  }

  out = out.replace(/site\.js/g, 'homepage.js?v=4');

  return out;
}

function migrateBlogListing(html) {
  let out = html;
  out = out.replace(/blog-listing\.css[^>]*>\s*/gi, '');
  if (!out.includes('pages.css')) {
    out = out.replace('homepage.css?v=4', 'homepage.css?v=5');
    out = out.replace(/homepage\.css[^>]*>/, (m) => m + '\n<link rel="stylesheet" href="/assets/css/pages.css?v=1">');
  }
  out = out.replace(/class="blog-page"/, 'class="blog-page site-page"');
  out = out.replace(/homepage\.js\?v=3/, 'homepage.js?v=4');
  return out;
}

let updated = 0;
for (const rel of collectTargets()) {
  const file = path.join(ROOT, rel);
  let before = fs.readFileSync(file, 'utf8');
  let after = rel === 'blog/index.html' ? migrateBlogListing(before) : injectChrome(before);

  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    console.log('updated:', rel);
    updated++;
  }
}

console.log('\nDone. Updated', updated, 'files.');

/**
 * Applies unified Neora chrome (nav, footer, CSS) to inner pages.
 * Run: node scripts/unify-chrome.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const NAV = `  <nav class="nav" role="navigation" aria-label="Main navigation">
    <div class="nav-inner">
      <a href="/" class="logo" aria-label="Neora AI Home">
        <div class="lmark" aria-hidden="true">
          <svg viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M8.5 1.5L10.2 6H15L11.1 8.8L12.8 13.5L8.5 10.5L4.2 13.5L5.9 8.8L2 6H6.8L8.5 1.5Z" fill="white"/>
          </svg>
        </div>
        <div class="ltext">
          <span class="lname">Neora AI</span>
          <span class="ltag">AI Tools Directory</span>
        </div>
      </a>
      <button class="nav-mobile-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-menu">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="nav-menu" role="list">
        <li><a href="/tools/">Tools</a></li>
        <li><a href="/compare/">Comparisons</a></li>
        <li><a href="/categories/">Categories</a></li>
        <li><a href="/guides/">Guides</a></li>
        <li><a href="/blog/">Blog</a></li>
      </ul>
      <div class="nav-r">
        <div class="nav-locale" aria-label="Language selector">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.4"/><path d="M10 2a14 14 0 010 16M2 10h16" stroke="currentColor" stroke-width="1.4"/></svg>
          EN
        </div>
        <a href="/tools/" class="nc">Explore Tools
          <svg viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      </div>
    </div>
  </nav>`;

const FOOTER = `  <footer class="footer" role="contentinfo">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="/" class="logo footer-logo" aria-label="Neora AI Home">
          <div class="lmark lmark-sm" aria-hidden="true">
            <svg viewBox="0 0 17 17" fill="none"><path d="M8.5 1.5L10.2 6H15L11.1 8.8L12.8 13.5L8.5 10.5L4.2 13.5L5.9 8.8L2 6H6.8L8.5 1.5Z" fill="white"/></svg>
          </div>
          <div class="ltext">
            <span class="lname">Neora AI</span>
            <span class="ltag">AI Tools Directory</span>
          </div>
        </a>
        <p class="footer-desc">Honest AI tool reviews, side-by-side comparisons, and expert guides to help you choose with confidence.</p>
      </div>
      <nav class="footer-cols" aria-label="Footer navigation">
        <div class="footer-col">
          <h3 class="fcol-title">Explore</h3>
          <a href="/tools/">All Tools</a>
          <a href="/compare/">Comparisons</a>
          <a href="/categories/">Categories</a>
          <a href="/guides/">Guides</a>
          <a href="/blog/">Blog</a>
        </div>
        <div class="footer-col">
          <h3 class="fcol-title">Company</h3>
          <a href="/about/">About</a>
          <a href="/contact/">Contact</a>
        </div>
        <div class="footer-col">
          <h3 class="fcol-title">Resources</h3>
          <a href="/sitemap.xml">Sitemap</a>
        </div>
        <div class="footer-col">
          <h3 class="fcol-title">Legal</h3>
          <a href="/privacy-policy/">Privacy Policy</a>
          <a href="/terms/">Terms of Use</a>
        </div>
      </nav>
    </div>
    <div class="footer-bottom">
      <p class="fcopy">&copy; <span id="footer-year">2026</span> Neora AI. All rights reserved.</p>
      <div class="footer-social" aria-label="Social media links">
        <a href="https://twitter.com/neoraai" aria-label="Follow Neora AI on Twitter" rel="noopener noreferrer" target="_blank">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M17 3L11 9l6 8H13L9 12l-6 5H1l6-6.5L1 3h4l4 5 6-5h2z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>
        </a>
        <a href="https://linkedin.com/company/neoraai" aria-label="Follow Neora AI on LinkedIn" rel="noopener noreferrer" target="_blank">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.4"/><path d="M6 8.5v5M6 6v.5M10 13.5v-2.8c0-1 .7-1.7 1.5-1.7s1.5.7 1.5 1.7v2.8M10 8.5v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        </a>
      </div>
    </div>
  </footer>
  <script src="/assets/js/site.js" defer></script>`;

const HEAD_LINKS = `  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">`;

function ensureFonts(html) {
  if (html.includes('family=Cairo') || html.includes('family=Inter')) return html;
  return html.replace('</head>', `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
</head>`);
}

const TARGETS = [
  'about/index.html',
  'contact/index.html',
  'privacy-policy/index.html',
  'terms/index.html',
  'blog/index.html',
  'blog/post.html',
  'compare/index.html',
  'tool/tools-list.html',
  'tool/index.html',
  'tool/detail.html',
  ...fs.readdirSync(path.join(ROOT, 'compare'))
    .filter(d => fs.existsSync(path.join(ROOT, 'compare', d, 'index.html')))
    .map(d => `compare/${d}/index.html`),
];

function stripInlineStyles(html) {
  return html.replace(/<style[^>]*>[\s\S]*?<\/style>\s*/gi, '');
}

function stripOldNav(html) {
  return html
    .replace(/<header class="topbar">[\s\S]*?<\/header>\s*/gi, '')
    .replace(/<header class="header">[\s\S]*?<\/header>\s*/gi, '')
    .replace(/^(\s*)<nav[^>]*>[\s\S]*?<\/nav>\s*/im, '');
}

function stripOldFooter(html) {
  return html.replace(/<footer[\s\S]*?<\/footer>\s*/i, '');
}

function injectHeadLinks(html) {
  if (html.includes('/assets/css/main.css')) return html;
  if (html.includes('</head>')) {
    return html.replace('</head>', HEAD_LINKS + '\n</head>');
  }
  return html;
}

function injectChrome(html) {
  let out = stripInlineStyles(html);
  out = stripOldNav(out);
  out = stripOldFooter(out);
  out = injectHeadLinks(out);

  // Remove duplicate old favicon
  out = out.replace(/<link rel="icon" href="\/assets\/images\/logos\/favicon\.png">\s*/gi, '');

  if (!out.includes('class="nav"')) {
    out = out.replace(/<body[^>]*>/, m => m + '\n\n' + NAV + '\n');
  }

  if (!out.includes('class="footer"')) {
    out = out.replace(/<\/body>/i, '\n' + FOOTER + '\n</body>');
  }

  out = ensureFonts(out);

  // Class renames for compatibility
  out = out
    .replace(/class="page-wrap"/g, 'class="container-narrow page-wrap"')
    .replace(/class="page-hero"/g, 'class="inner-hero page-hero"')
    .replace(/class="hero-badge"/g, 'class="hbadge page-badge"')
    .replace(/class="content-wrap"/g, 'class="container-narrow content-wrap"')
    .replace(/class="tool-desc"/g, 'class="tool-desc-text"')
    .replace(/<main>/g, '<main class="page-main">');

  return out;
}

let updated = 0;
for (const rel of TARGETS) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    console.warn('skip (missing):', rel);
    continue;
  }
  const before = fs.readFileSync(file, 'utf8');
  const after = injectChrome(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    console.log('updated:', rel);
    updated++;
  }
}

// Create tools/index.html from tools-list if missing
const toolsIndex = path.join(ROOT, 'tools/index.html');
const toolsList = path.join(ROOT, 'tool/tools-list.html');
if (!fs.existsSync(toolsIndex) && fs.existsSync(toolsList)) {
  fs.mkdirSync(path.join(ROOT, 'tools'), { recursive: true });
  let content = fs.readFileSync(toolsList, 'utf8');
  content = content.replace('https://neora-ai.com/tool/', 'https://neora-ai.com/tools/');
  content = content.replace(/\/tool\//g, '/tools/');
  fs.writeFileSync(toolsIndex, content, 'utf8');
  console.log('created: tools/index.html');
  updated++;
}

console.log('\nDone. Updated', updated, 'files.');

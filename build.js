// build.js — Netlify Build Script
// يقرأ ملفات .md من الجذر ومن _tools/ ويبني tools-index.json + sitemap.xml

const fs   = require('fs');
const path = require('path');

// ---- قراءة frontmatter ----
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const obj = {};
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    if (key) obj[key] = val;
  });
  return obj;
}

// ---- تحويل الأرقام العربية ----
function toLatinDigits(str) {
  return String(str || '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
}

// ---- هل القيمة مسار صورة؟ ----
function isImageSrc(str) {
  if (!str) return false;
  const s = str.trim();
  return (
    s.startsWith('http://') ||
    s.startsWith('https://') ||
    s.startsWith('/images/') ||
    s.startsWith('/uploads/') ||
    s.startsWith('/static/') ||
    /\.(png|jpg|jpeg|gif|webp|svg|ico)(\?.*)?$/i.test(s)
  );
}

// ---- slug ----
function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---- أيقونة افتراضية حسب التصنيف ----
const DEFAULT_ICONS = {
  chat: '💬', image: '🎨', video: '🎬', code: '💻',
  writing: '✍️', voice: '🎙️', productivity: '⚡',
  research: '🔬', data: '📊',
};

// ---- ملفات يجب تجاهلها في الجذر ----
const IGNORE_FILES = new Set([
  'README.md', 'CHANGELOG.md', 'LICENSE.md',
  'ads.txt', '_redirects',
]);

// ---- جمع ملفات .md من مسار معين ----
function collectMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f =>
      f.endsWith('.md') &&
      !IGNORE_FILES.has(f) &&
      !f.startsWith('_') &&
      !f.startsWith('.')
    )
    .map(f => path.join(dir, f));
}

// ---- تحويل ملف .md إلى كائن أداة ----
function mdFileToTool(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fm = parseFrontmatter(content);

  // تجاهل الملفات التي ليس فيها title أو url
  if (!fm.title && !fm.url) return null;

  const fileSlug = path.basename(filePath, '.md');
  const id  = fm.id || slugify(fm.title || fileSlug) || fileSlug;
  const cat = fm.category || 'chat';

  const ratingRaw = toLatinDigits(fm.rating || '4.5');
  const rating    = parseFloat(ratingRaw) || 4.5;

  // ── معالجة الأيقونة ──
  const iconRaw  = (fm.icon || '').trim();
  const emojiRaw = (fm.icon_emoji || '').trim();
  const fallback = emojiRaw || DEFAULT_ICONS[cat] || '🤖';

  let iconFinal, iconImgFinal;
  if (isImageSrc(iconRaw)) {
    iconFinal    = iconRaw;
    iconImgFinal = iconRaw;
  } else if (iconRaw) {
    iconFinal    = iconRaw;
    iconImgFinal = '';
  } else {
    iconFinal    = fallback;
    iconImgFinal = '';
  }

  return {
    id,
    slug:    fileSlug,
    name:    fm.title || '',
    title:   fm.title || '',
    cat,
    ar:      fm.keywords_ar || fm.title || '',
    en:      fm.keywords_en || fm.title || '',
    badge:   fm.badge  || 'free',
    icon:    iconFinal,
    icon_img: iconImgFinal,
    icon_emoji: fallback,
    icon_bg: 'background:rgba(212,175,55,0.1)',
    desc_ar: fm.desc_ar  || fm.description || '',
    desc_en: fm.desc_en  || fm.description || '',
    stars:   String(rating),
    tags_ar: [cat],
    aff_badge:        fm.commission ? `💰 ${fm.commission}` : '',
    commission:       fm.commission || '',
    url:              fm.affiliate_url || fm.url || '#',
    rel:              fm.affiliate_url ? 'nofollow sponsored' : 'noopener',
    official_partner: false,
    pricing_ar:       fm.pricing_ar || '',
    _source:          'cms',
  };
}

// ================================================================
// التنفيذ الرئيسي
// ================================================================

const ROOT       = __dirname;
const TOOLS_JSON = path.join(ROOT, 'tools-index.json');

// 1. اجمع ملفات .md من الجذر + من _tools/ إن وُجد
const rootFiles  = collectMdFiles(ROOT);
const toolsFiles = collectMdFiles(path.join(ROOT, '_tools'));

// ادمجهم وأزل التكرار بالاسم
const allFiles = [...new Map(
  [...rootFiles, ...toolsFiles].map(f => [path.basename(f), f])
).values()];

console.log(`[build] ملفات .md: ${rootFiles.length} في الجذر + ${toolsFiles.length} في _tools/ = ${allFiles.length} إجمالاً`);

// 2. حوّل كل ملف إلى كائن أداة
const cmsTools = allFiles
  .map(mdFileToTool)
  .filter(Boolean);

console.log(`[build] أدوات صالحة: ${cmsTools.length}`);

// 3. إزالة التكرار بالـ id
const seenIds   = new Set();
const seenNames = new Set();
const deduped   = cmsTools.filter(t => {
  const name = (t.name || '').toLowerCase().trim();
  if (seenIds.has(t.id) || seenNames.has(name)) {
    console.warn(`[build] ⚠️ تكرار محذوف: ${t.id}`);
    return false;
  }
  seenIds.add(t.id);
  if (name) seenNames.add(name);
  return true;
});

// 4. اكتب ملف tools-index.json
fs.writeFileSync(TOOLS_JSON, JSON.stringify(deduped, null, 2), 'utf8');
console.log(`[build] ✅ tools-index.json: ${deduped.length} أداة`);

// ================================================================
// توليد sitemap.xml تلقائياً
// ================================================================
function generateSitemap() {
  const BASE = 'https://neora-ai.com';
  const postsPath = path.join(ROOT, 'posts-index.json');
  const posts = fs.existsSync(postsPath)
    ? JSON.parse(fs.readFileSync(postsPath, 'utf8'))
    : [];

  const compareDir  = path.join(ROOT, 'compare');
  const compareDirs = fs.existsSync(compareDir)
    ? fs.readdirSync(compareDir).filter(d =>
        fs.statSync(path.join(compareDir, d)).isDirectory()
      )
    : [];

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    '',
    '  <url>',
    `    <loc>${BASE}/</loc>`,
    `    <xhtml:link rel="alternate" hreflang="ar" href="${BASE}/"/>`,
    `    <xhtml:link rel="alternate" hreflang="en" href="${BASE}/?lang=en"/>`,
    '    <changefreq>daily</changefreq>',
    '    <priority>1.0</priority>',
    '  </url>',
    '',
    '  <url>',
    `    <loc>${BASE}/blog/</loc>`,
    '    <changefreq>daily</changefreq>',
    '    <priority>0.9</priority>',
    '  </url>',
    '',
  ];

  posts.forEach(p => {
    if (!p.slug) return;
    const enc = encodeURIComponent(p.slug).replace(/%2F/g, '/');
    lines.push('  <url>');
    lines.push(`    <loc>${BASE}/blog/${enc}</loc>`);
    if (p.date) lines.push(`    <lastmod>${p.date}</lastmod>`);
    lines.push('    <changefreq>monthly</changefreq>');
    lines.push('    <priority>0.8</priority>');
    lines.push('  </url>');
  });

  lines.push('');
  lines.push('  <url>');
  lines.push(`    <loc>${BASE}/compare/</loc>`);
  lines.push('    <changefreq>weekly</changefreq>');
  lines.push('    <priority>0.85</priority>');
  lines.push('  </url>');

  compareDirs.forEach(d => {
    lines.push('  <url>');
    lines.push(`    <loc>${BASE}/compare/${d}/</loc>`);
    lines.push('    <changefreq>monthly</changefreq>');
    lines.push('    <priority>0.75</priority>');
    lines.push('  </url>');
  });

  lines.push('');

  deduped.forEach(t => {
    const tid = t.id || t.slug;
    if (!tid) return;
    lines.push('  <url>');
    lines.push(`    <loc>${BASE}/tool/${tid}</loc>`);
    lines.push('    <changefreq>monthly</changefreq>');
    lines.push('    <priority>0.7</priority>');
    lines.push('  </url>');
  });

  lines.push('');
  lines.push('</urlset>');

  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, lines.join('\n'), 'utf8');
  const total = 2 + posts.length + 1 + compareDirs.length + deduped.length;
  console.log(`[build] ✅ sitemap.xml: ${total} URLs`);
}

generateSitemap();

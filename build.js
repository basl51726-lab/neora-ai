// build.js — Netlify Build Script
// يقرأ كل ملفات _tools/*.md ويبني tools-index.json تلقائياً
// يعمل عند كل deploy على Netlify

const fs   = require('fs');
const path = require('path');

// ---- قراءة frontmatter بدون مكتبات خارجية ----
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

// ---- بناء الـ slug من اسم الملف ----
function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---- تحديد الأيقونة حسب التصنيف ----
const DEFAULT_ICONS = {
  chat: '💬', image: '🎨', video: '🎬', code: '💻',
  writing: '✍️', voice: '🎙️', productivity: '⚡',
  research: '🔬', data: '📊',
};

// ---- قراءة الأدوات الأصلية من tools-index.json ----
const TOOLS_JSON = path.join(__dirname, 'tools-index.json');
let baseTools = [];
try {
  baseTools = JSON.parse(fs.readFileSync(TOOLS_JSON, 'utf8'));
  console.log(`[build] قراءة ${baseTools.length} أداة أصلية من tools-index.json`);
} catch(e) {
  console.warn('[build] tools-index.json غير موجود، سيتم إنشاؤه من _tools فقط');
}

// ---- قراءة ملفات _tools/*.md ----
const TOOLS_DIR = path.join(__dirname, '_tools');
let cmsTools = [];

if (fs.existsSync(TOOLS_DIR)) {
  const files = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('.md'));
  console.log(`[build] وجدت ${files.length} أداة في _tools/`);

  cmsTools = files.map(file => {
    const content = fs.readFileSync(path.join(TOOLS_DIR, file), 'utf8');
    const fm = parseFrontmatter(content);
    const fileSlug = path.basename(file, '.md');
    const id = fm.id || slugify(fm.title || fileSlug) || fileSlug;
    const cat = fm.category || 'chat';

    return {
      id,
      name:    fm.title      || '',
      title:   fm.title      || '',
      cat,
      ar:      fm.keywords_ar || fm.title || '',
      en:      fm.keywords_en || fm.title || '',
      badge:   fm.badge      || 'free',
      icon:    fm.icon       || DEFAULT_ICONS[cat] || '🤖',
      icon_bg: 'background:rgba(0,212,255,0.1)',
      desc_ar: fm.desc_ar    || fm.description || '',
      desc_en: fm.desc_en    || fm.description || '',
      stars:   String(fm.rating || '4.5'),
      tags_ar: [cat],
      aff_badge:       fm.commission ? `💰 ${fm.commission}` : '',
      commission:      fm.commission || '',
      url:             fm.affiliate_url || fm.url || '#',
      rel:             fm.affiliate_url ? 'nofollow sponsored' : 'noopener',
      official_partner: false,
      pricing_ar:      fm.pricing_ar || '',
      _source:         'cms',
    };
  });
} else {
  console.log('[build] مجلد _tools غير موجود بعد، سيتم استخدام tools-index.json فقط');
}

// ---- دمج: الأدوات الأصلية + أدوات CMS (بدون تكرار) ----
const baseIds = new Set(baseTools.map(t => t.id));
const newCmsTools = cmsTools.filter(t => !baseIds.has(t.id));
const updatedCmsTools = cmsTools.filter(t => baseIds.has(t.id));

// حدّث الأدوات الموجودة إذا عُدِّلت من CMS
const mergedBase = baseTools.map(bt => {
  const updated = updatedCmsTools.find(ct => ct.id === bt.id);
  return updated ? { ...bt, ...updated } : bt;
});

const allTools = [...mergedBase, ...newCmsTools];

// ---- احفظ tools-index.json ----
fs.writeFileSync(TOOLS_JSON, JSON.stringify(allTools, null, 2), 'utf8');

console.log(`[build] ✅ tools-index.json محدّث: ${allTools.length} أداة`);
console.log(`  - أدوات أصلية: ${mergedBase.length}`);
console.log(`  - أدوات جديدة من CMS: ${newCmsTools.length}`);
console.log(`  - أدوات محدّثة من CMS: ${updatedCmsTools.length}`);

// ---- قراءة مقالات _posts/*.md لمعلومات إضافية ----
const POSTS_DIR = path.join(__dirname, '_posts');
if (fs.existsSync(POSTS_DIR)) {
  const posts = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  console.log(`[build] وجدت ${posts.length} مقال في _posts/ (لا تأثير على tools-index)`);
}

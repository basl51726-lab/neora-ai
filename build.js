// build.js — Netlify Build Script
// يقرأ كل ملفات _tools/*.md ويبني tools-index.json تلقائياً

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

// ---- تحويل الأرقام العربية إلى إنجليزية ----
function toLatinDigits(str) {
  return String(str || '').replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
}

// ---- هل القيمة رابط URL؟ ----
function isURL(str) {
  return /^https?:\/\//i.test(str || '');
}

// ---- هل القيمة إيموجي حقيقي؟ ----
function isEmoji(str) {
  if (!str) return false;
  if (isURL(str)) return false;
  // إيموجي عادةً أقل من 5 أحرف وليس URL
  return str.trim().length <= 8;
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

// ---- slug الجذر: أول كلمة فقط (claude-code → claude) ----
function baseSlug(str) {
  return slugify(str).split('-')[0];
}

// ---- أيقونة افتراضية حسب التصنيف ----
const DEFAULT_ICONS = {
  chat: '💬', image: '🎨', video: '🎬', code: '💻',
  writing: '✍️', voice: '🎙️', productivity: '⚡',
  research: '🔬', data: '📊',
};

// ---- إذا كانت الأيقونة URL → نبني img tag ----
function buildIconHTML(iconVal, cat) {
  if (!iconVal || iconVal.trim() === '') {
    return DEFAULT_ICONS[cat] || '🤖';
  }
  if (isURL(iconVal)) {
    // نرجع object خاص يعرف buildToolCard أنه صورة
    return { type: 'img', src: iconVal };
  }
  return iconVal; // إيموجي عادي
}

// ---- قراءة الأدوات الأصلية ----
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
    const id  = fm.id || slugify(fm.title || fileSlug) || fileSlug;
    const cat = fm.category || 'chat';

    // تصحيح التقييم — يقبل أرقام عربية وإنجليزية
    const ratingRaw = toLatinDigits(fm.rating || '4.5');
    const rating    = parseFloat(ratingRaw) || 4.5;

    // تصحيح الأيقونة — يقبل إيموجي أو URL أو فارغ
    const iconRaw  = (fm.icon || '').trim();
    const iconData = buildIconHTML(iconRaw, cat);

    // إذا كانت الأيقونة صورة نبني icon و icon_img
    const isImgIcon = typeof iconData === 'object' && iconData.type === 'img';

    return {
      id,
      name:    fm.title || '',
      title:   fm.title || '',
      cat,
      ar:      fm.keywords_ar || fm.title || '',
      en:      fm.keywords_en || fm.title || '',
      badge:   fm.badge  || 'free',
      icon:    isImgIcon ? (DEFAULT_ICONS[cat] || '🤖') : (iconData || DEFAULT_ICONS[cat] || '🤖'),
      icon_img: isImgIcon ? iconData.src : '',   // رابط الصورة إن وُجد
      icon_bg: 'background:rgba(0,212,255,0.1)',
      desc_ar: fm.desc_ar     || fm.description || '',
      desc_en: fm.desc_en     || fm.description || '',
      stars:   String(rating),
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
  console.log('[build] مجلد _tools غير موجود بعد');
}

// ---- دمج: الأدوات الأصلية + أدوات CMS ----
const baseIds    = new Set(baseTools.map(t => t.id));
const baseNames  = new Set(baseTools.map(t => (t.name || t.title || '').toLowerCase().trim()));
const baseSlugs  = new Set(baseTools.map(t => slugify(t.name || t.title || '')));

// أداة CMS مكررة = نفس الـ id أو نفس الاسم أو نفس الـ slug أو نفس الجذر
function isDuplicate(ct) {
  const ctSlug     = slugify(ct.name || ct.title || '');
  const ctName     = (ct.name || ct.title || '').toLowerCase().trim();
  const ctBaseSlug = baseSlug(ct.name || ct.title || '');
  return baseIds.has(ct.id) || baseNames.has(ctName) || baseSlugs.has(ctSlug) || baseSlugs.has(ctBaseSlug);
}

const newCmsTools = cmsTools.filter(t => !isDuplicate(t));
const updatedCms  = cmsTools.filter(t => isDuplicate(t));

// حدّث الأدوات الموجودة (مطابقة بـ id أو name أو slug)
const mergedBase = baseTools.map(bt => {
  const btName = (bt.name || bt.title || '').toLowerCase().trim();
  const btSlug = slugify(bt.name || bt.title || '');
  const updated = updatedCms.find(ct =>
    ct.id === bt.id ||
    (ct.name || ct.title || '').toLowerCase().trim() === btName ||
    slugify(ct.name || ct.title || '') === btSlug
  );
  return updated ? { ...bt, ...updated } : bt;
});

const allTools = [...mergedBase, ...newCmsTools];

// تأكد نهائي — احذف أي تكرار في id
const seenIds = new Set();
const deduped = allTools.filter(t => {
  if (seenIds.has(t.id)) { console.warn(`[build] ⚠️ تكرار محذوف: ${t.id}`); return false; }
  seenIds.add(t.id);
  return true;
});

fs.writeFileSync(TOOLS_JSON, JSON.stringify(deduped, null, 2), 'utf8');

console.log(`[build] ✅ tools-index.json محدّث: ${deduped.length} أداة`);
console.log(`  - أدوات أصلية:        ${mergedBase.length}`);
console.log(`  - أدوات جديدة من CMS: ${newCmsTools.length}`);
console.log(`  - أدوات محدّثة:       ${updatedCms.length}`);

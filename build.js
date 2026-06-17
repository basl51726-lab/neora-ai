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

// ---- هل القيمة مسار صورة؟ (يكشف URL خارجي + مسار داخلي) ----
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

// ---- بناء الـ slug من اسم الملف ----
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

    // تصحيح التقييم
    const ratingRaw = toLatinDigits(fm.rating || '4.5');
    const rating    = parseFloat(ratingRaw) || 4.5;

    // ── معالجة الأيقونة ──────────────────────────────────────
    // icon  = مسار صورة مرفوعة: /images/uploads/tool.png
    //       أو URL خارجي:       https://example.com/icon.png
    //       أو إيموجي:           🤖
    // icon_emoji = إيموجي احتياطي (الحقل الجديد في config.yml)
    const iconRaw   = (fm.icon || '').trim();
    const emojiRaw  = (fm.icon_emoji || '').trim();
    const fallback  = emojiRaw || DEFAULT_ICONS[cat] || '🤖';

    let iconFinal;   // ما يُعرض في الأيقونة (إيموجي أو مسار)
    let iconImgFinal; // مسار الصورة إن وُجدت

    if (isImageSrc(iconRaw)) {
      // صورة حقيقية مرفوعة
      iconFinal    = iconRaw;   // نمرر المسار كاملاً لـ buildToolCard
      iconImgFinal = iconRaw;
    } else if (iconRaw) {
      // إيموجي أو رمز نصي
      iconFinal    = iconRaw;
      iconImgFinal = '';
    } else {
      // فارغ — نستخدم الإيموجي الاحتياطي
      iconFinal    = fallback;
      iconImgFinal = '';
    }
    // ─────────────────────────────────────────────────────────

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
  });
} else {
  console.log('[build] مجلد _tools غير موجود بعد');
}

// ---- دمج: الأدوات الأصلية + أدوات CMS ----
const baseIds   = new Set(baseTools.map(t => t.id));
const baseNames = new Set(baseTools.map(t => (t.name || t.title || '').toLowerCase().trim()));

function isDuplicate(ct) {
  const ctName = (ct.name || ct.title || '').toLowerCase().trim();
  return baseIds.has(ct.id) || baseNames.has(ctName);
}

const newCmsTools = cmsTools.filter(t => !isDuplicate(t));
const updatedCms  = cmsTools.filter(t =>  isDuplicate(t));

const mergedBase = baseTools.map(bt => {
  const btName = (bt.name || bt.title || '').toLowerCase().trim();
  const updated = updatedCms.find(ct =>
    ct.id === bt.id ||
    (ct.name || ct.title || '').toLowerCase().trim() === btName
  );
  return updated ? { ...bt, ...updated } : bt;
});

const allTools = [...mergedBase, ...newCmsTools];

// تأكد نهائي — احذف أي تكرار في id
const seenIds = new Set();
const deduped = allTools.filter(t => {
  if (seenIds.has(t.id)) {
    console.warn(`[build] ⚠️ تكرار محذوف: ${t.id}`);
    return false;
  }
  seenIds.add(t.id);
  return true;
});

fs.writeFileSync(TOOLS_JSON, JSON.stringify(deduped, null, 2), 'utf8');

console.log(`[build] ✅ tools-index.json محدّث: ${deduped.length} أداة`);
console.log(`  - أدوات أصلية:        ${mergedBase.length}`);
console.log(`  - أدوات جديدة من CMS: ${newCmsTools.length}`);
console.log(`  - أدوات محدّثة:       ${updatedCms.length}`);

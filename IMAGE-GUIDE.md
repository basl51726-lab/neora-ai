# دليل نظام الصور – Neora AI

## هيكل المجلدات

```
/assets/images/
├── comparisons/          ← صور صفحات المقارنة
│   ├── replit-agent-vs-lovable.jpg
│   ├── cursor-vs-windsurf.jpg
│   ├── chatgpt-vs-claude.jpg
│   └── ...
├── blog/                 ← صور مقالات المدونة
│   ├── windsurf-review.jpg
│   └── ...
├── tools/                ← أيقونات وشعارات الأدوات
│   ├── chatgpt.jpg
│   ├── claude.jpg
│   └── ...
├── categories/           ← صور التصنيفات
│   └── ...
└── default-cover.jpg     ← صورة احتياطية (مطلوبة دائماً)
```

---

## قاعدة المسارات

### ✅ الصحيح دائماً

```html
<img
  src="/assets/images/comparisons/replit-agent-vs-lovable.jpg"
  alt="مقارنة Replit Agent و Lovable"
  width="1200"
  height="630"
  loading="lazy"
  onerror="this.src='/assets/images/default-cover.jpg'; this.onerror=null;"
>
```

### ✗ ممنوع تماماً

```html
<!-- ✗ مسار نسبي -->
<img src="images/replit-agent-vs-lovable.jpg">

<!-- ✗ مسار نسبي بنقطة -->
<img src="./images/replit-agent-vs-lovable.jpg">

<!-- ✗ مسار بنقطتين -->
<img src="../images/replit-agent-vs-lovable.jpg">

<!-- ✗ في جذر الموقع بدون مجلد assets -->
<img src="/replit-agent-vs-lovable.jpg">
```

---

## قواعد تسمية الملفات

| نوع الصفحة     | صيغة الاسم                          | مثال                              |
|----------------|--------------------------------------|-----------------------------------|
| صفحة مقارنة   | `tool-a-vs-tool-b.jpg`              | `cursor-vs-windsurf.jpg`          |
| مقال مدونة     | `article-slug.jpg`                  | `best-ai-coding-tools-2026.jpg`   |
| أداة           | `tool-name.jpg`                     | `chatgpt.jpg`                     |
| تصنيف          | `category-name.jpg`                 | `coding-tools.jpg`                |

**قواعد الأسماء:**
- أحرف صغيرة فقط
- كلمات مفصولة بـ `-` (شرطة)
- بدون مسافات أو أحرف عربية في الاسم
- امتداد `.jpg` دائماً (أو `.png` للصور الشفافة)

---

## خطوات رفع صورة جديدة

### لصفحة مقارنة جديدة مثل "ChatGPT vs Claude"

1. **احضر الصورة** بأبعاد `1200 × 630` بكسل
2. **سمّها** `chatgpt-vs-claude.jpg`
3. **ارفعها** على GitHub في المسار:
   ```
   assets/images/comparisons/chatgpt-vs-claude.jpg
   ```
4. **استخدم في HTML:**
   ```html
   <img
     src="/assets/images/comparisons/chatgpt-vs-claude.jpg"
     alt="مقارنة ChatGPT و Claude"
     width="1200"
     height="630"
     loading="lazy"
     onerror="this.src='/assets/images/default-cover.jpg'; this.onerror=null;"
   >
   ```
5. **تحقق قبل النشر:**
   ```bash
   node check-images.js
   ```

---

## التحقق قبل النشر (check-images.js)

أضف هذا السطر في `netlify.toml` لمنع النشر إذا كانت الصور ناقصة:

```toml
[build]
  publish = "."
  command = "node check-images.js && node build.js"
```

عند تشغيل `check-images.js` يحدث:
- ✅ إذا كل الصور موجودة → يكمل البناء
- 🚫 إذا صورة ناقصة → يوقف النشر ويُظهر تقريراً

---

## الصورة الاحتياطية (default-cover.jpg)

**مطلوب:** ضع صورة باسم `default-cover.jpg` في:
```
/assets/images/default-cover.jpg
```

هذه الصورة تظهر تلقائياً إذا فشل تحميل أي صورة أخرى بفضل:
```html
onerror="this.src='/assets/images/default-cover.jpg'; this.onerror=null;"
```

---

## تحديث صفحة replit-agent-vs-lovable الحالية

استبدل سطر الصورة الحالي بـ:

```html
<img
  src="/assets/images/comparisons/replit-agent-vs-lovable.jpg"
  alt="مقارنة Replit Agent و Lovable"
  width="1200"
  height="630"
  loading="lazy"
  onerror="this.src='/assets/images/default-cover.jpg'; this.onerror=null;"
>
```

ثم ارفع الصورة على GitHub في:
```
assets/images/comparisons/replit-agent-vs-lovable.jpg
```

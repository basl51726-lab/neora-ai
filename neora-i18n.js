/**
 * NEORA 3.0 — Bilingual i18n Engine
 * ===================================
 * Usage on every page:
 *   1. Include this script in <head>
 *   2. Add data-i18n="key" to any element
 *   3. Add data-i18n-placeholder="key" for inputs
 *   4. Add data-i18n-meta to <html> for page-level SEO
 *   5. Call NeoraI18n.init() on DOMContentLoaded
 */

const NeoraI18n = (() => {

  // ─────────────────────────────────────────────
  //  TRANSLATION DICTIONARY
  // ─────────────────────────────────────────────
  const dict = {

    // ── GLOBAL / NAV ──────────────────────────
    "nav.explore":        { ar: "استكشف",              en: "Explore" },
    "nav.compare":        { ar: "المقارنات",            en: "Compare" },
    "nav.articles":       { ar: "المقالات",             en: "Articles" },
    "nav.categories":     { ar: "التصنيفات",           en: "Categories" },
    "nav.studio":         { ar: "Neora Studio",         en: "Neora Studio" },
    "nav.submit":         { ar: "أضف أداة",             en: "Submit Tool" },
    "nav.newsletter":     { ar: "النشرة البريدية",      en: "Newsletter" },
    "nav.toggle.dark":    { ar: "الوضع الداكن",         en: "Dark Mode" },
    "nav.toggle.light":   { ar: "الوضع الفاتح",         en: "Light Mode" },

    // ── HERO ──────────────────────────────────
    "hero.pill":          { ar: "مقارنة جديدة: Claude Code مقابل OpenAI Codex", en: "New comparison: Claude Code vs OpenAI Codex" },
    "hero.h1.line1":      { ar: "اكتشف أفضل",           en: "Discover the Best" },
    "hero.h1.em":         { ar: "أدوات الذكاء الاصطناعي", en: "AI Tools" },
    "hero.h1.line2":      { ar: "لكل مهمة تحتاجها",    en: "for Every Task You Need" },
    "hero.sub":           { ar: "دليل منتقى بعناية، مُقيَّم ومُرتَّب من مستخدمين حقيقيين — لتجد الأداة الصحيحة بسرعة", en: "Carefully curated, rated and ranked by real users — so you find the right tool fast" },
    "hero.trust":         { ar: "موثوق به من أكثر من 12,000 متخصص في الذكاء الاصطناعي", en: "Trusted by over 12,000 AI enthusiasts worldwide" },
    "hero.search.btn":    { ar: "بحث",                  en: "Search" },
    "hero.search.ph":     { ar: "ابحث عن أدوات، تصنيفات، حالات استخدام…", en: "Search tools, categories, use cases…" },

    // ── STATS ─────────────────────────────────
    "stat.tools":         { ar: "أداة ذكاء اصطناعي",   en: "AI Tools" },
    "stat.compare":       { ar: "مقارنة متعمقة",        en: "In-depth Comparisons" },
    "stat.cats":          { ar: "تصنيفات",              en: "Categories" },
    "stat.readers":       { ar: "قارئ شهرياً",          en: "Monthly Readers" },

    // ── SECTION HEADERS ───────────────────────
    "sec.popular":        { ar: "الأدوات الأكثر شعبية", en: "Popular Tools" },
    "sec.categories":     { ar: "تصفح حسب التصنيف",    en: "Browse by Category" },
    "sec.comparisons":    { ar: "مقارنات مميزة",        en: "Featured Comparisons" },
    "sec.weekly":         { ar: "اختيارات نيورا الأسبوعية", en: "Neora's Weekly Picks" },
    "sec.articles":       { ar: "أحدث المقالات",        en: "Latest Articles" },
    "sec.recommended":    { ar: "أدوات موصى بها",       en: "Recommended Tools" },
    "sec.why":            { ar: "لماذا NEORA؟",          en: "Why NEORA?" },
    "sec.viewall":        { ar: "عرض الكل",             en: "View all" },
    "sec.allcats":        { ar: "جميع التصنيفات",       en: "All categories" },
    "sec.allcmp":         { ar: "جميع المقارنات",       en: "All comparisons" },

    // ── TOOL CARDS ────────────────────────────
    "tool.visit":         { ar: "زيارة",                en: "Visit" },
    "tool.details":       { ar: "تفاصيل",               en: "Details" },
    "tool.badge.free":    { ar: "مجاني",                en: "Free" },
    "tool.badge.top":     { ar: "الأعلى تقييماً",       en: "Top Rated" },
    "tool.badge.dev":     { ar: "اختيار المطورين",      en: "Dev Pick" },
    "tool.badge.new":     { ar: "جديد",                 en: "New" },
    "tool.reviews":       { ar: "تقييم",                en: "reviews" },

    // ── CATEGORIES ────────────────────────────
    "cat.writing":        { ar: "الكتابة",              en: "Writing" },
    "cat.image":          { ar: "الصور",                en: "Image" },
    "cat.video":          { ar: "الفيديو",              en: "Video" },
    "cat.code":           { ar: "البرمجة",              en: "Code" },
    "cat.research":       { ar: "البحث",                en: "Research" },
    "cat.productivity":   { ar: "الإنتاجية",            en: "Productivity" },
    "cat.marketing":      { ar: "التسويق",              en: "Marketing" },
    "cat.audio":          { ar: "الصوت",                en: "Audio" },
    "cat.design":         { ar: "التصميم",              en: "Design" },
    "cat.tools.count":    { ar: "أداة",                 en: "tools" },

    // ── COMPARISON CARDS ──────────────────────
    "cmp.read":           { ar: "اقرأ المقارنة",        en: "Read comparison" },
    "cmp.editors.pick":   { ar: "اختيار المحرر",        en: "Editor's Pick" },

    // ── TRENDING TABS ─────────────────────────
    "trend.tools":        { ar: "أدوات",                en: "Tools" },
    "trend.compare":      { ar: "مقارنات",              en: "Compare" },
    "trend.new":          { ar: "جديد",                 en: "New" },
    "trend.featured":     { ar: "مميز",                 en: "Featured" },
    "trend.recommended":  { ar: "موصى به",              en: "Recommended" },

    // ── NEORA STUDIO ──────────────────────────
    "studio.badge":       { ar: "وصول مبكر حصري — Neora Studio", en: "Exclusive Early Access — Neora Studio" },
    "studio.h":           { ar: "مساحتك الذكية لاستكشاف عالم الذكاء الاصطناعي", en: "Your Smart Space to Explore the World of AI" },
    "studio.sub":         { ar: "بيئة متكاملة لتجربة أدوات الذكاء الاصطناعي ومقارنتها جنباً إلى جنب — مصممة خصيصاً لتجربة عربية استثنائية", en: "An integrated environment to try and compare AI tools side by side — designed for an exceptional experience" },
    "studio.cta":         { ar: "احجز مقعدك مجاناً",   en: "Reserve Your Free Seat" },
    "studio.ghost":       { ar: "اعرف المزيد",          en: "Learn More" },

    // ── AFFILIATE SECTION ─────────────────────
    "aff.sponsored":      { ar: "برعاية",               en: "Sponsored" },
    "aff.try":            { ar: "جرّب مجاناً",          en: "Try Free" },
    "aff.mo":             { ar: "شهر",                  en: "mo" },
    "aff.best.general":   { ar: "الأفضل للاستخدام العام", en: "Best for general use" },
    "aff.best.dev":       { ar: "الأفضل للمطورين",      en: "Best for developers" },
    "aff.best.marketing": { ar: "الأفضل للتسويق",       en: "Best for marketing" },
    "aff.best.prod":      { ar: "الأفضل للإنتاجية",     en: "Best for productivity" },

    // ── WHY NEORA ─────────────────────────────
    "why.1.title":        { ar: "محتوى محايد وموثوق",   en: "Independent & Trusted" },
    "why.1.desc":         { ar: "كل أداة تُراجع بناءً على جودتها الفعلية. المحتوى المدفوع دائماً مُصنَّف بوضوح تام", en: "Every tool is reviewed on its own merit. Sponsored content is always clearly labeled." },
    "why.2.title":        { ar: "تحديث مستمر",          en: "Always Up to Date" },
    "why.2.desc":         { ar: "فريقنا يحدّث قوائم الأدوات أسبوعياً مع كل تغيير في الميزات والأسعار والنماذج", en: "Our team updates listings weekly as features, pricing, and models evolve." },
    "why.3.title":        { ar: "تقييمات حقيقية",       en: "Real User Ratings" },
    "why.3.desc":         { ar: "التقييمات من مستخدمين حقيقيين موثّقين — لا إعلانات مدفوعة ولا بيانات مزيفة", en: "Ratings come from verified real users — no paid placements, no fake data." },
    "why.4.title":        { ar: "مقارنات معمّقة",       en: "In-depth Comparisons" },
    "why.4.desc":         { ar: "تحليل شامل جنباً إلى جنب في الأسعار والميزات والأداء الفعلي في الحياة اليومية", en: "Comprehensive side-by-side analysis of pricing, features, and real-world performance." },

    // ── NEWSLETTER ────────────────────────────
    "nl.h":               { ar: "ابقَ في طليعة الذكاء الاصطناعي", en: "Stay Ahead of AI" },
    "nl.sub":             { ar: "احصل على أفضل أدوات الذكاء الاصطناعي والمقارنات والأدلة أسبوعياً — مجاناً للأبد، مباشرة إلى بريدك", en: "Get the best AI tools, comparisons, and guides weekly — free forever, straight to your inbox." },
    "nl.ph":              { ar: "بريدك الإلكتروني",      en: "Your email address" },
    "nl.btn":             { ar: "اشترك الآن",            en: "Subscribe Now" },

    // ── FINAL CTA ─────────────────────────────
    "cta.eyebrow":        { ar: "ابدأ الاستكشاف اليوم", en: "Start Exploring Today" },
    "cta.h":              { ar: "الأداة الصحيحة تُغيّر كل شيء.\nابحث عنها هنا.", en: "The Right Tool Changes Everything.\nFind It Here." },
    "cta.sub":            { ar: "أكثر من 70 أداة في 8 تصنيفات، مقارنات معمّقة، ومراجعات حقيقية — كل ما تحتاجه في مكان واحد", en: "Over 70 tools across 8 categories, in-depth comparisons, and real reviews — everything you need in one place." },
    "cta.primary":        { ar: "استكشف جميع الأدوات",  en: "Explore All Tools" },
    "cta.secondary":      { ar: "أضف أداتك",            en: "Submit Your Tool" },

    // ── FOOTER ────────────────────────────────
    "footer.brand":       { ar: "دليل متميز لاستكشاف ومقارنة أدوات الذكاء الاصطناعي — موثوق به من أكثر من 12,000 قارئ", en: "The premium directory for discovering and comparing AI tools — trusted by over 12,000 readers." },
    "footer.explore.h":   { ar: "استكشف",               en: "Explore" },
    "footer.company.h":   { ar: "الشركة",               en: "Company" },
    "footer.search.h":    { ar: "بحث شائع",             en: "Popular Searches" },
    "footer.alltools":    { ar: "جميع الأدوات",         en: "All Tools" },
    "footer.cats":        { ar: "التصنيفات",            en: "Categories" },
    "footer.cmp":         { ar: "المقارنات",            en: "Comparisons" },
    "footer.articles":    { ar: "المقالات",             en: "Articles" },
    "footer.submit":      { ar: "أضف أداة",             en: "Submit a Tool" },
    "footer.about":       { ar: "عن NEORA",             en: "About NEORA" },
    "footer.studio":      { ar: "Neora Studio",          en: "Neora Studio" },
    "footer.newsletter":  { ar: "النشرة البريدية",      en: "Newsletter" },
    "footer.advertise":   { ar: "الإعلانات",            en: "Advertise" },
    "footer.privacy":     { ar: "سياسة الخصوصية",       en: "Privacy Policy" },
    "footer.terms":       { ar: "شروط الاستخدام",       en: "Terms of Use" },
    "footer.search1":     { ar: "أفضل أدوات الكتابة",   en: "Best AI Writing Tools" },
    "footer.search2":     { ar: "أدوات الصور",          en: "AI Image Tools" },
    "footer.search3":     { ar: "أدوات مجانية",         en: "Free AI Tools" },
    "footer.search4":     { ar: "أدوات البرمجة",        en: "AI Coding Tools" },
    "footer.search5":     { ar: "بدائل ChatGPT",         en: "ChatGPT Alternatives" },
    "footer.copy":        { ar: "© 2025 NEORA. جميع الحقوق محفوظة.", en: "© 2025 NEORA. All rights reserved." },
    "footer.made":        { ar: "صُنع بشغف لمجتمع الذكاء الاصطناعي العربي", en: "Made with passion for the AI community" },

    // ── TOOLS PAGE ────────────────────────────
    "tools.page.title":   { ar: "جميع الأدوات",         en: "All Tools" },
    "tools.filter.all":   { ar: "الكل",                 en: "All" },
    "tools.filter.free":  { ar: "مجاني",                en: "Free" },
    "tools.filter.paid":  { ar: "مدفوع",                en: "Paid" },
    "tools.sort.label":   { ar: "ترتيب حسب:",           en: "Sort by:" },
    "tools.sort.rating":  { ar: "التقييم",              en: "Rating" },
    "tools.sort.newest":  { ar: "الأحدث",               en: "Newest" },
    "tools.sort.popular": { ar: "الأكثر شعبية",         en: "Most Popular" },
    "tools.results":      { ar: "نتيجة",                en: "results" },
    "tools.no.results":   { ar: "لا توجد أدوات مطابقة", en: "No matching tools found" },
    "tools.search.ph":    { ar: "ابحث في الأدوات…",    en: "Search tools…" },

    // ── COMPARE PAGE ──────────────────────────
    "cmp.page.title":     { ar: "المقارنات",            en: "Comparisons" },
    "cmp.winner":         { ar: "الفائز",               en: "Winner" },
    "cmp.tie":            { ar: "تعادل",                en: "Tie" },
    "cmp.category.label": { ar: "التصنيف",              en: "Category" },
    "cmp.updated":        { ar: "آخر تحديث",            en: "Last updated" },
    "cmp.read.full":      { ar: "اقرأ المقارنة الكاملة", en: "Read Full Comparison" },
    "cmp.verdict":        { ar: "الحكم النهائي",        en: "Final Verdict" },

    // ── ARTICLE / BLOG PAGE ───────────────────
    "article.by":         { ar: "بقلم",                 en: "By" },
    "article.updated":    { ar: "محدّث في",             en: "Updated" },
    "article.mins":       { ar: "دقائق قراءة",          en: "min read" },
    "article.share":      { ar: "شارك المقال",          en: "Share Article" },
    "article.related":    { ar: "مقالات ذات صلة",       en: "Related Articles" },
    "article.toc":        { ar: "محتويات المقال",       en: "Table of Contents" },

    // ── ABOUT PAGE ────────────────────────────
    "about.title":        { ar: "عن NEORA",             en: "About NEORA" },
    "about.mission.h":    { ar: "مهمتنا",               en: "Our Mission" },
    "about.mission.body": { ar: "نساعد المستخدمين العرب على اكتشاف أفضل أدوات الذكاء الاصطناعي وتقييمها باحترافية وشفافية.", en: "We help users discover and evaluate the best AI tools with professionalism and transparency." },
    "about.team.h":       { ar: "فريق نيورا",           en: "The NEORA Team" },
    "about.contact.h":    { ar: "تواصل معنا",           en: "Contact Us" },

    // ── CONTACT PAGE ──────────────────────────
    "contact.title":      { ar: "تواصل معنا",           en: "Contact Us" },
    "contact.name.ph":    { ar: "الاسم الكامل",         en: "Full Name" },
    "contact.email.ph":   { ar: "البريد الإلكتروني",    en: "Email Address" },
    "contact.msg.ph":     { ar: "رسالتك…",              en: "Your message…" },
    "contact.send":       { ar: "إرسال الرسالة",        en: "Send Message" },
    "contact.success":    { ar: "تم إرسال رسالتك بنجاح!", en: "Your message was sent successfully!" },

    // ── PRIVACY PAGE ──────────────────────────
    "privacy.title":      { ar: "سياسة الخصوصية",       en: "Privacy Policy" },
    "privacy.updated":    { ar: "آخر تحديث: يونيو 2025", en: "Last updated: June 2025" },

    // ── TERMS PAGE ────────────────────────────
    "terms.title":        { ar: "شروط الاستخدام",       en: "Terms of Use" },
    "terms.updated":      { ar: "آخر تحديث: يونيو 2025", en: "Last updated: June 2025" },

    // ── COMMON UI ─────────────────────────────
    "ui.back":            { ar: "رجوع",                 en: "Back" },
    "ui.loading":         { ar: "جارٍ التحميل…",        en: "Loading…" },
    "ui.error":           { ar: "حدث خطأ ما",           en: "Something went wrong" },
    "ui.retry":           { ar: "إعادة المحاولة",       en: "Try Again" },
    "ui.readmore":        { ar: "اقرأ المزيد",          en: "Read More" },
    "ui.close":           { ar: "إغلاق",                en: "Close" },
    "ui.copy":            { ar: "نسخ الرابط",           en: "Copy Link" },
    "ui.copied":          { ar: "تم النسخ!",            en: "Copied!" },
  };

  // ─────────────────────────────────────────────
  //  PAGE-LEVEL SEO METADATA
  // ─────────────────────────────────────────────
  const pageMeta = {
    home: {
      ar: { title: "نيورا — اكتشف أفضل أدوات الذكاء الاصطناعي", desc: "دليل متميز لأدوات الذكاء الاصطناعي — مراجعات ومقارنات وتصنيفات لأكثر من 70 أداة ذكاء اصطناعي." },
      en: { title: "NEORA — Discover the Best AI Tools", desc: "The premium AI tools directory — reviews, comparisons, and rankings for 70+ AI tools." }
    },
    tools: {
      ar: { title: "جميع أدوات الذكاء الاصطناعي — نيورا", desc: "تصفح أكثر من 70 أداة ذكاء اصطناعي مصنّفة ومرتبة حسب التقييم والتصنيف والسعر." },
      en: { title: "All AI Tools — NEORA", desc: "Browse 70+ AI tools sorted by rating, category, and price." }
    },
    compare: {
      ar: { title: "مقارنات أدوات الذكاء الاصطناعي — نيورا", desc: "مقارنات معمّقة بين أفضل أدوات الذكاء الاصطناعي لمساعدتك في اتخاذ القرار الصحيح." },
      en: { title: "AI Tool Comparisons — NEORA", desc: "In-depth comparisons between the best AI tools to help you make the right choice." }
    },
    articles: {
      ar: { title: "مقالات الذكاء الاصطناعي — نيورا", desc: "أحدث المقالات والأدلة حول أدوات الذكاء الاصطناعي وكيفية الاستفادة منها." },
      en: { title: "AI Articles & Guides — NEORA", desc: "The latest articles and guides on AI tools and how to get the most from them." }
    },
    categories: {
      ar: { title: "تصنيفات أدوات الذكاء الاصطناعي — نيورا", desc: "تصفح أدوات الذكاء الاصطناعي حسب التصنيف: كتابة، صور، فيديو، برمجة، بحث والمزيد." },
      en: { title: "AI Tool Categories — NEORA", desc: "Browse AI tools by category: writing, image, video, code, research, and more." }
    },
    about: {
      ar: { title: "عن نيورا — دليل الذكاء الاصطناعي العربي", desc: "تعرّف على نيورا، مهمتنا، وفريقنا المتخصص في أدوات الذكاء الاصطناعي." },
      en: { title: "About NEORA — The Arabic AI Tools Directory", desc: "Learn about NEORA, our mission, and the team behind the AI tools directory." }
    },
    contact: {
      ar: { title: "تواصل مع نيورا", desc: "تواصل مع فريق نيورا لأي استفسار، شراكة، أو اقتراح." },
      en: { title: "Contact NEORA", desc: "Get in touch with the NEORA team for inquiries, partnerships, or suggestions." }
    },
    privacy: {
      ar: { title: "سياسة الخصوصية — نيورا", desc: "تعرّف على كيفية جمع واستخدام وحماية بياناتك على موقع نيورا." },
      en: { title: "Privacy Policy — NEORA", desc: "Learn how NEORA collects, uses, and protects your data." }
    },
    terms: {
      ar: { title: "شروط الاستخدام — نيورا", desc: "اقرأ شروط وأحكام استخدام موقع نيورا لدليل أدوات الذكاء الاصطناعي." },
      en: { title: "Terms of Use — NEORA", desc: "Read the terms and conditions for using the NEORA AI tools directory." }
    },
  };

  // ─────────────────────────────────────────────
  //  CORE ENGINE
  // ─────────────────────────────────────────────
  const STORAGE_KEY = "neora_lang";
  const SUPPORTED   = ["ar", "en"];
  const DEFAULT     = "ar";

  let currentLang = DEFAULT;

  function getLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.includes(saved) ? saved : DEFAULT;
    } catch { return DEFAULT; }
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
    currentLang = lang;
    applyLang(lang);
  }

  function t(key) {
    const entry = dict[key];
    if (!entry) { console.warn(`[NEORA i18n] Missing key: ${key}`); return key; }
    return entry[currentLang] || entry[DEFAULT] || key;
  }

  function applyLang(lang) {
    // ── Direction & lang attribute ──
    const isAr = lang === "ar";
    document.documentElement.dir  = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    // ── Translate all data-i18n elements ──
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    });

    // ── Translate placeholders ──
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      el.placeholder = t(key);
    });

    // ── Translate aria-labels ──
    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
      const key = el.getAttribute("data-i18n-aria");
      el.setAttribute("aria-label", t(key));
    });

    // ── Translate HTML content (allows <em> etc.) ──
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      const key = el.getAttribute("data-i18n-html");
      el.innerHTML = t(key);
    });

    // ── Update SEO meta ──
    const pageKey = document.documentElement.getAttribute("data-page") || "home";
    const meta    = pageMeta[pageKey]?.[lang];
    if (meta) {
      document.title = meta.title;
      const desc = document.querySelector('meta[name="description"]');
      if (desc) desc.content = meta.desc;
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.content = meta.title;
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.content = meta.desc;
    }

    // ── Update hreflang ──
    updateHreflang(lang);

    // ── Update active lang button ──
    document.querySelectorAll("[data-lang-btn]").forEach(btn => {
      const isActive = btn.getAttribute("data-lang-btn") === lang;
      btn.classList.toggle("on", isActive);
    });

    // ── Fire custom event for dynamic content ──
    document.dispatchEvent(new CustomEvent("neora:langchange", { detail: { lang } }));
  }

  function updateHreflang(lang) {
    // Remove old hreflang links
    document.querySelectorAll('link[rel="alternate"]').forEach(l => l.remove());
    const url = window.location.href.split("?")[0];
    SUPPORTED.forEach(l => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = l;
      link.href = url + (url.includes("?") ? "&" : "?") + "lang=" + l;
      document.head.appendChild(link);
    });
  }

  function init(pageKey) {
    if (pageKey) document.documentElement.setAttribute("data-page", pageKey);
    currentLang = getLang();

    // Check URL param (for direct links like ?lang=en)
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang && SUPPORTED.includes(urlLang)) {
      currentLang = urlLang;
      try { localStorage.setItem(STORAGE_KEY, urlLang); } catch {}
    }

    applyLang(currentLang);

    // Wire up all lang switcher buttons
    document.querySelectorAll("[data-lang-btn]").forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang-btn")));
    });
  }

  // Public API
  return { init, setLang, getLang, t, applyLang, dict, pageMeta };
})();

// Auto-init if DOM already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => NeoraI18n.init());
} else {
  NeoraI18n.init();
}

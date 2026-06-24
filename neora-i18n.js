/**
 * NEORA 3.0 — Bilingual i18n Engine
 * Single source of truth for all UI text (AR / EN)
 * Persists selection in localStorage key: neora_lang
 */
const NeoraI18n = (() => {

  // ── Full translation dictionary ──────────────────────────────────────────
  const dict = {

    // NAV
    "nav.home":         { ar:"الرئيسية",          en:"Home" },
    "nav.tools":        { ar:"الأدوات",           en:"Tools" },
    "nav.categories":   { ar:"التصنيفات",         en:"Categories" },
    "nav.compare":      { ar:"المقارنات",         en:"Compare" },
    "nav.blog":         { ar:"المدونة",           en:"Blog" },
    "nav.about":        { ar:"من نحن",            en:"About" },
    "nav.contact":      { ar:"تواصل معنا",        en:"Contact" },
    "nav.submit":       { ar:"أضف أداة",          en:"Submit Tool" },
    "nav.newsletter":   { ar:"النشرة البريدية",   en:"Newsletter" },
    "nav.studio":       { ar:"Neora Studio",       en:"Neora Studio" },

    // HERO
    "hero.pill":        { ar:"✦ دليلك المتميز لأدوات الذكاء الاصطناعي", en:"✦ Your Premium AI Tools Directory" },
    "hero.h1":          { ar:"اكتشف أفضل أدوات الذكاء الاصطناعي\nلمشاريعك", en:"Discover the Best AI Tools\nfor Your Projects" },
    "hero.sub":         { ar:"دليل منتقى بعناية — مراجعات حقيقية، مقارنات معمّقة، وتحديث أسبوعي", en:"Carefully curated — real reviews, deep comparisons, updated weekly" },
    "hero.search.ph":   { ar:"ابحث عن أداة ذكاء اصطناعي…",          en:"Search for an AI tool…" },
    "hero.search.btn":  { ar:"بحث",               en:"Search" },
    "hero.trust":       { ar:"موثوق به من آلاف المتخصصين في الذكاء الاصطناعي حول العالم", en:"Trusted by thousands of AI enthusiasts worldwide" },

    // SECTIONS
    "sec.popular":      { ar:"الأدوات الأكثر شعبية",    en:"Popular Tools" },
    "sec.categories":   { ar:"تصفح حسب التصنيف",       en:"Browse by Category" },
    "sec.comparisons":  { ar:"مقارنات مميزة",           en:"Featured Comparisons" },
    "sec.weekly":       { ar:"اختيارات نيورا الأسبوعية", en:"Neora's Weekly Picks" },
    "sec.articles":     { ar:"أحدث المقالات",           en:"Latest Articles" },
    "sec.recommended":  { ar:"أدوات موصى بها",          en:"Recommended Tools" },
    "sec.why":          { ar:"لماذا NEORA؟",            en:"Why NEORA?" },
    "sec.viewall":      { ar:"عرض الكل",               en:"View all" },
    "sec.allcats":      { ar:"جميع التصنيفات",         en:"All Categories" },
    "sec.allcmp":       { ar:"جميع المقارنات",         en:"All Comparisons" },
    "sec.allposts":     { ar:"جميع المقالات",          en:"All Articles" },

    // TOOL CARDS
    "tool.visit":       { ar:"زيارة",              en:"Visit" },
    "tool.details":     { ar:"التفاصيل",           en:"Details" },
    "tool.free":        { ar:"مجاني",              en:"Free" },
    "tool.paid":        { ar:"مدفوع",              en:"Paid" },
    "tool.freemium":    { ar:"مجاني جزئياً",       en:"Freemium" },
    "tool.top":         { ar:"الأعلى تقييماً",     en:"Top Rated" },
    "tool.dev":         { ar:"اختيار المطورين",    en:"Dev Pick" },
    "tool.new":         { ar:"جديد",               en:"New" },
    "tool.reviews":     { ar:"تقييم",              en:"reviews" },
    "tool.loading":     { ar:"جارٍ تحميل الأدوات…", en:"Loading tools…" },
    "tool.none":        { ar:"لا توجد أدوات مطابقة", en:"No tools found" },

    // TOOL PAGE
    "tool.about":       { ar:"عن الأداة",          en:"About this Tool" },
    "tool.features":    { ar:"المميزات",           en:"Features" },
    "tool.pricing":     { ar:"الأسعار",            en:"Pricing" },
    "tool.alternatives":{ ar:"أدوات مشابهة",      en:"Similar Tools" },
    "tool.pros":        { ar:"المميزات",           en:"Pros" },
    "tool.cons":        { ar:"العيوب",             en:"Cons" },
    "tool.visit.site":  { ar:"زيارة الموقع الرسمي", en:"Visit Official Site" },
    "tool.added":       { ar:"تاريخ الإضافة",      en:"Date Added" },
    "tool.updated":     { ar:"آخر تحديث",          en:"Last Updated" },
    "tool.category.label":{ ar:"التصنيف",         en:"Category" },

    // CATEGORIES
    "cat.writing":      { ar:"الكتابة",           en:"Writing" },
    "cat.image":        { ar:"الصور",             en:"Image" },
    "cat.video":        { ar:"الفيديو",           en:"Video" },
    "cat.code":         { ar:"البرمجة",           en:"Code" },
    "cat.research":     { ar:"البحث",             en:"Research" },
    "cat.productivity": { ar:"الإنتاجية",         en:"Productivity" },
    "cat.marketing":    { ar:"التسويق",           en:"Marketing" },
    "cat.audio":        { ar:"الصوت",             en:"Audio" },
    "cat.design":       { ar:"التصميم",           en:"Design" },
    "cat.all":          { ar:"الكل",              en:"All" },
    "cat.tools.count":  { ar:"أداة",              en:"tools" },

    // FILTERS
    "filter.sort":      { ar:"ترتيب:",            en:"Sort:" },
    "filter.all":       { ar:"الكل",              en:"All" },
    "filter.free":      { ar:"مجاني",             en:"Free" },
    "filter.paid":      { ar:"مدفوع",             en:"Paid" },
    "filter.rating":    { ar:"الأعلى تقييماً",    en:"Highest Rated" },
    "filter.newest":    { ar:"الأحدث",            en:"Newest" },
    "filter.popular":   { ar:"الأكثر شعبية",      en:"Most Popular" },
    "filter.search.ph": { ar:"ابحث في الأدوات…",  en:"Search tools…" },
    "filter.results":   { ar:"نتيجة",             en:"results" },

    // COMPARE
    "cmp.editors.pick": { ar:"اختيار المحرر",     en:"Editor's Pick" },
    "cmp.read":         { ar:"اقرأ المقارنة",     en:"Read Comparison" },
    "cmp.read.full":    { ar:"اقرأ المقارنة الكاملة", en:"Read Full Comparison" },
    "cmp.winner":       { ar:"الفائز",            en:"Winner" },
    "cmp.tie":          { ar:"تعادل",             en:"Tie" },
    "cmp.verdict":      { ar:"الحكم النهائي",     en:"Final Verdict" },
    "cmp.updated":      { ar:"آخر تحديث",         en:"Last Updated" },
    "cmp.loading":      { ar:"جارٍ تحميل المقارنات…", en:"Loading comparisons…" },
    "cmp.none":         { ar:"لا توجد مقارنات",   en:"No comparisons found" },

    // BLOG
    "blog.by":          { ar:"بقلم",              en:"By" },
    "blog.mins":        { ar:"دقائق قراءة",       en:"min read" },
    "blog.updated":     { ar:"محدّث في",          en:"Updated" },
    "blog.share":       { ar:"شارك المقال",       en:"Share Article" },
    "blog.related":     { ar:"مقالات ذات صلة",   en:"Related Articles" },
    "blog.toc":         { ar:"محتويات المقال",    en:"Table of Contents" },
    "blog.loading":     { ar:"جارٍ تحميل المقالات…", en:"Loading articles…" },
    "blog.none":        { ar:"لا توجد مقالات",   en:"No articles found" },
    "blog.readmore":    { ar:"اقرأ المزيد",       en:"Read More" },
    "blog.cats.roundup":{ ar:"قائمة شاملة",      en:"Roundup" },
    "blog.cats.guide":  { ar:"دليل",             en:"Guide" },
    "blog.cats.compare":{ ar:"مقارنة",           en:"Comparison" },
    "blog.cats.news":   { ar:"أخبار",            en:"News" },
    "blog.cats.tutorial":{ ar:"درس",             en:"Tutorial" },

    // TRENDING BADGES
    "trend.featured":    { ar:"مميز",             en:"Featured" },
    "trend.new":         { ar:"جديد",             en:"New" },
    "trend.recommended": { ar:"موصى به",          en:"Recommended" },
    "trend.hot":         { ar:"رائج",             en:"Hot" },

    // STUDIO
    "studio.badge":     { ar:"✨ وصول مبكر حصري — Neora Studio", en:"✨ Exclusive Early Access — Neora Studio" },
    "studio.h":         { ar:"مساحتك الذكية لاستكشاف عالم الذكاء الاصطناعي", en:"Your Smart Space to Explore the AI World" },
    "studio.sub":       { ar:"بيئة متكاملة لتجربة أدوات الذكاء الاصطناعي ومقارنتها جنباً إلى جنب", en:"An integrated environment to try and compare AI tools side by side" },
    "studio.cta":       { ar:"احجز مقعدك مجاناً", en:"Reserve Your Free Seat" },
    "studio.ghost":     { ar:"اعرف المزيد",       en:"Learn More" },

    // AFFILIATE
    "aff.sponsored":    { ar:"برعاية",            en:"Sponsored" },
    "aff.try":          { ar:"جرّب مجاناً",       en:"Try Free" },
    "aff.mo":           { ar:"شهر",               en:"mo" },
    "aff.best.general": { ar:"الأفضل للاستخدام العام", en:"Best for general use" },
    "aff.best.dev":     { ar:"الأفضل للمطورين",   en:"Best for developers" },
    "aff.best.mkt":     { ar:"الأفضل للتسويق",    en:"Best for marketing" },
    "aff.best.prod":    { ar:"الأفضل للإنتاجية",  en:"Best for productivity" },

    // WHY NEORA
    "why.1.title":      { ar:"محتوى محايد وموثوق", en:"Independent & Trusted" },
    "why.1.desc":       { ar:"كل أداة تُراجع بناءً على جودتها الفعلية. المحتوى المدفوع مُصنَّف بوضوح", en:"Every tool reviewed on its own merit. Paid content is always clearly labeled." },
    "why.2.title":      { ar:"تحديث مستمر",       en:"Always Up to Date" },
    "why.2.desc":       { ar:"فريقنا يحدّث قوائم الأدوات أسبوعياً مع كل تغيير في الميزات والأسعار", en:"Our team updates listings weekly as features and pricing change." },
    "why.3.title":      { ar:"تقييمات حقيقية",    en:"Real User Ratings" },
    "why.3.desc":       { ar:"التقييمات من مستخدمين حقيقيين — لا إعلانات مدفوعة ولا بيانات مزيفة", en:"Ratings from verified real users — no paid placements, no fake data." },
    "why.4.title":      { ar:"مقارنات معمّقة",    en:"Deep Comparisons" },
    "why.4.desc":       { ar:"تحليل شامل في الأسعار والميزات والأداء الفعلي في الحياة اليومية", en:"Comprehensive analysis of pricing, features, and real-world performance." },

    // NEWSLETTER
    "nl.h":             { ar:"ابقَ في طليعة الذكاء الاصطناعي", en:"Stay Ahead of AI" },
    "nl.sub":           { ar:"احصل على أفضل أدوات الذكاء الاصطناعي والمقارنات والأدلة أسبوعياً — مجاناً للأبد", en:"Get the best AI tools, comparisons and guides weekly — free forever." },
    "nl.ph":            { ar:"بريدك الإلكتروني",  en:"Your email address" },
    "nl.btn":           { ar:"اشترك الآن",        en:"Subscribe Now" },
    "nl.privacy":       { ar:"لن نرسل بريداً مزعجاً. يمكنك إلغاء الاشتراك في أي وقت.", en:"No spam. Unsubscribe at any time." },

    // FINAL CTA
    "cta.eyebrow":      { ar:"ابدأ الاستكشاف",   en:"Start Exploring" },
    "cta.h":            { ar:"الأداة الصحيحة تُغيّر كل شيء.\nابحث عنها هنا.", en:"The Right Tool Changes Everything.\nFind It Here." },
    "cta.sub":          { ar:"دليل شامل لأكثر من 70 أداة ذكاء اصطناعي، مقارنات معمّقة، ومراجعات حقيقية", en:"A comprehensive directory of AI tools, deep comparisons, and real reviews." },
    "cta.primary":      { ar:"استكشف الأدوات",   en:"Explore Tools" },
    "cta.secondary":    { ar:"أضف أداتك",         en:"Submit Your Tool" },

    // FOOTER
    "footer.brand":     { ar:"دليل متميز لاستكشاف ومقارنة أدوات الذكاء الاصطناعي — موثوق به من آلاف القراء", en:"The premium AI tools directory — trusted by thousands of readers." },
    "footer.explore":   { ar:"استكشف",            en:"Explore" },
    "footer.company":   { ar:"الشركة",            en:"Company" },
    "footer.searches":  { ar:"بحث شائع",          en:"Popular Searches" },
    "footer.alltools":  { ar:"جميع الأدوات",      en:"All Tools" },
    "footer.cats":      { ar:"التصنيفات",         en:"Categories" },
    "footer.cmp":       { ar:"المقارنات",         en:"Comparisons" },
    "footer.blog":      { ar:"المدونة",           en:"Blog" },
    "footer.submit":    { ar:"أضف أداة",          en:"Submit a Tool" },
    "footer.about":     { ar:"من نحن",            en:"About NEORA" },
    "footer.studio":    { ar:"Neora Studio",       en:"Neora Studio" },
    "footer.nl":        { ar:"النشرة البريدية",   en:"Newsletter" },
    "footer.advertise": { ar:"الإعلانات",         en:"Advertise" },
    "footer.privacy":   { ar:"سياسة الخصوصية",   en:"Privacy Policy" },
    "footer.terms":     { ar:"شروط الاستخدام",   en:"Terms of Use" },
    "footer.contact":   { ar:"تواصل معنا",        en:"Contact" },
    "footer.s1":        { ar:"أفضل أدوات الكتابة", en:"Best Writing AI Tools" },
    "footer.s2":        { ar:"أدوات الصور",       en:"AI Image Tools" },
    "footer.s3":        { ar:"أدوات مجانية",      en:"Free AI Tools" },
    "footer.s4":        { ar:"أدوات البرمجة",     en:"AI Coding Tools" },
    "footer.s5":        { ar:"بدائل ChatGPT",     en:"ChatGPT Alternatives" },
    "footer.copy":      { ar:"© 2025 NEORA. جميع الحقوق محفوظة.", en:"© 2025 NEORA. All rights reserved." },
    "footer.made":      { ar:"صُنع بشغف لمجتمع الذكاء الاصطناعي", en:"Made with passion for the AI community" },

    // ABOUT
    "about.title":      { ar:"من نحن",            en:"About NEORA" },
    "about.sub":        { ar:"نيورا هو دليل متميز لأدوات الذكاء الاصطناعي", en:"NEORA is a premium AI tools directory" },
    "about.mission.h":  { ar:"مهمتنا",            en:"Our Mission" },
    "about.mission":    { ar:"نساعد المستخدمين العرب والعالميين على اكتشاف أفضل أدوات الذكاء الاصطناعي واتخاذ قرارات مستنيرة بناءً على مراجعات حقيقية ومقارنات شاملة.", en:"We help Arabic and global users discover the best AI tools and make informed decisions based on real reviews and comprehensive comparisons." },
    "about.what.h":     { ar:"ماذا نقدم؟",        en:"What We Offer" },
    "about.what.1":     { ar:"مراجعات موضوعية لأكثر من 70 أداة ذكاء اصطناعي", en:"Objective reviews of 70+ AI tools" },
    "about.what.2":     { ar:"مقارنات معمّقة بين الأدوات المتنافسة", en:"In-depth comparisons between competing tools" },
    "about.what.3":     { ar:"دليل مصنّف حسب الاستخدام والتصنيف",  en:"Directory categorized by use case and category" },
    "about.what.4":     { ar:"محتوى مُحدَّث أسبوعياً",            en:"Weekly updated content" },
    "about.team.h":     { ar:"فريقنا",             en:"Our Team" },
    "about.team.sub":   { ar:"نحن فريق من المتحمسين لتقنية الذكاء الاصطناعي نؤمن بأن الوصول إلى المعلومات الصحيحة يُغيّر حياة الناس.", en:"We are a team of AI technology enthusiasts who believe access to the right information changes lives." },
    "about.cta.h":      { ar:"هل تريد الإدراج في نيورا؟", en:"Want to be listed on NEORA?" },
    "about.cta.sub":    { ar:"إذا كانت لديك أداة ذكاء اصطناعي وتريد إدراجها في دليلنا، راسلنا الآن.", en:"If you have an AI tool and want it listed in our directory, contact us now." },
    "about.cta.btn":    { ar:"تواصل معنا",        en:"Contact Us" },

    // CONTACT
    "contact.title":    { ar:"تواصل معنا",        en:"Contact Us" },
    "contact.sub":      { ar:"هل لديك سؤال أو اقتراح أو تريد إدراج أداتك؟ راسلنا.", en:"Have a question, suggestion, or want to list your tool? Reach out." },
    "contact.name.ph":  { ar:"الاسم الكامل",      en:"Full Name" },
    "contact.email.ph": { ar:"البريد الإلكتروني", en:"Email Address" },
    "contact.subject.ph":{ ar:"الموضوع",         en:"Subject" },
    "contact.msg.ph":   { ar:"رسالتك…",           en:"Your message…" },
    "contact.send":     { ar:"إرسال الرسالة",     en:"Send Message" },
    "contact.success":  { ar:"✓ تم إرسال رسالتك بنجاح! سنرد خلال 24–48 ساعة.", en:"✓ Message sent successfully! We'll reply within 24–48 hours." },
    "contact.info.h":   { ar:"معلومات التواصل",  en:"Contact Info" },
    "contact.email.label":{ ar:"البريد الإلكتروني:", en:"Email:" },
    "contact.social.h": { ar:"تابعنا",            en:"Follow Us" },

    // PRIVACY
    "privacy.title":    { ar:"سياسة الخصوصية",   en:"Privacy Policy" },
    "privacy.updated":  { ar:"آخر تحديث: يونيو 2025", en:"Last updated: June 2025" },
    "privacy.intro":    { ar:"تلتزم نيورا بحماية خصوصيتك. تشرح هذه السياسة كيفية جمع بياناتك واستخدامها وحمايتها.", en:"NEORA is committed to protecting your privacy. This policy explains how your data is collected, used, and protected." },
    "privacy.collect.h":{ ar:"البيانات التي نجمعها", en:"Data We Collect" },
    "privacy.collect":  { ar:"نجمع بيانات الاستخدام الأساسية مثل الصفحات التي تزورها واللغة المفضلة لديك والمتصفح الذي تستخدمه. لا نجمع معلومات شخصية دون موافقتك.", en:"We collect basic usage data such as pages you visit, your preferred language, and your browser. We do not collect personal information without your consent." },
    "privacy.cookies.h":{ ar:"ملفات تعريف الارتباط (Cookies)", en:"Cookies" },
    "privacy.cookies":  { ar:"نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتذكر تفضيلاتك مثل اللغة المختارة.", en:"We use cookies to improve your experience and remember your preferences such as selected language." },
    "privacy.analytics.h":{ ar:"التحليلات",       en:"Analytics" },
    "privacy.analytics":{ ar:"نستخدم Google Analytics وMicrosoft Clarity لفهم كيفية استخدام الموقع. هذه الأدوات قد تجمع بيانات مجهولة الهوية.", en:"We use Google Analytics and Microsoft Clarity to understand site usage. These tools may collect anonymized data." },
    "privacy.contact.h":{ ar:"التواصل",          en:"Contact" },
    "privacy.contact":  { ar:"إذا كان لديك استفسار حول خصوصيتك، تواصل معنا عبر صفحة التواصل.", en:"If you have a privacy inquiry, contact us via the contact page." },

    // TERMS
    "terms.title":      { ar:"شروط الاستخدام",   en:"Terms of Use" },
    "terms.updated":    { ar:"آخر تحديث: يونيو 2025", en:"Last updated: June 2025" },
    "terms.intro":      { ar:"باستخدامك لموقع نيورا، فإنك توافق على الشروط التالية.", en:"By using NEORA, you agree to the following terms." },
    "terms.use.h":      { ar:"الاستخدام المقبول", en:"Acceptable Use" },
    "terms.use":        { ar:"يُسمح باستخدام الموقع للأغراض الشخصية والتجارية المشروعة. يُحظر نسخ المحتوى أو إعادة نشره دون إذن.", en:"Use of the site is permitted for lawful personal and commercial purposes. Copying or republishing content without permission is prohibited." },
    "terms.ip.h":       { ar:"الملكية الفكرية",  en:"Intellectual Property" },
    "terms.ip":         { ar:"جميع المحتويات على نيورا محمية بحقوق الملكية الفكرية. جميع الحقوق محفوظة.", en:"All content on NEORA is protected by intellectual property rights. All rights reserved." },
    "terms.affiliate.h":{ ar:"الروابط التابعة",  en:"Affiliate Links" },
    "terms.affiliate":  { ar:"قد يحتوي الموقع على روابط تابعة (Affiliate Links). قد نحصل على عمولة عند إجراء عمليات شراء عبر هذه الروابط.", en:"The site may contain affiliate links. We may earn a commission when purchases are made through these links." },
    "terms.disclaimer.h":{ ar:"إخلاء المسؤولية", en:"Disclaimer" },
    "terms.disclaimer": { ar:"نيورا يقدم معلومات تعليمية فقط. التقييمات والمراجعات تعبّر عن آراء المحررين ولا تمثل ضمانة للأداء.", en:"NEORA provides educational information only. Ratings and reviews express editorial opinions and do not constitute performance guarantees." },
    "terms.contact.h":  { ar:"التواصل",          en:"Contact" },
    "terms.contact":    { ar:"للأسئلة المتعلقة بشروط الاستخدام، تواصل معنا.", en:"For questions about these terms, contact us." },

    // COMMON UI
    "ui.back":          { ar:"رجوع",              en:"Back" },
    "ui.loading":       { ar:"جارٍ التحميل…",     en:"Loading…" },
    "ui.error":         { ar:"حدث خطأ ما",        en:"Something went wrong" },
    "ui.retry":         { ar:"إعادة المحاولة",    en:"Try Again" },
    "ui.close":         { ar:"إغلاق",             en:"Close" },
    "ui.copy":          { ar:"نسخ الرابط",        en:"Copy Link" },
    "ui.copied":        { ar:"تم النسخ!",         en:"Copied!" },
    "ui.share":         { ar:"شارك",              en:"Share" },
    "ui.readmore":      { ar:"اقرأ المزيد",       en:"Read More" },
    "ui.notfound":      { ar:"الصفحة غير موجودة", en:"Page Not Found" },
    "ui.goback":        { ar:"العودة للرئيسية",   en:"Go to Homepage" },
  };

  
   
  // ── Per-page SEO metadata ─────────────────────────────────────────────────
  const pageMeta = {
    home:     { ar:{ title:"نيورا — اكتشف أفضل أدوات الذكاء الاصطناعي",    desc:"دليل متميز لأدوات الذكاء الاصطناعي — مراجعات ومقارنات وتصنيفات." },
                en:{ title:"NEORA — Discover the Best AI Tools",              desc:"The premium AI tools directory — reviews, comparisons, and rankings." }},
    tools:    { ar:{ title:"جميع أدوات الذكاء الاصطناعي — نيورا",           desc:"تصفح مجموعة واسعة من أدوات الذكاء الاصطناعي المُراجعة والمُصنّفة." },
                en:{ title:"All AI Tools — NEORA",                            desc:"Browse a wide range of reviewed and categorized AI tools." }},
    categories:{ ar:{ title:"تصنيفات الأدوات — نيورا",                       desc:"تصفح أدوات الذكاء الاصطناعي حسب التصنيف." },
                 en:{ title:"Tool Categories — NEORA",                        desc:"Browse AI tools by category." }},
    compare:  { ar:{ title:"مقارنات أدوات الذكاء الاصطناعي — نيورا",        desc:"مقارنات معمّقة بين أفضل أدوات الذكاء الاصطناعي." },
                en:{ title:"AI Tool Comparisons — NEORA",                     desc:"In-depth comparisons between the best AI tools." }},
    articles: { ar:{ title:"المدونة — نيورا",                                desc:"أحدث المقالات والأدلة حول أدوات الذكاء الاصطناعي." },
                en:{ title:"Blog — NEORA",                                    desc:"Latest articles and guides on AI tools." }},
    about:    { ar:{ title:"من نحن — نيورا",                                 desc:"تعرّف على نيورا، مهمتنا، وفريقنا." },
                en:{ title:"About NEORA",                                     desc:"Learn about NEORA, our mission and team." }},
    contact:  { ar:{ title:"تواصل معنا — نيورا",                             desc:"تواصل مع فريق نيورا." },
                en:{ title:"Contact NEORA",                                   desc:"Get in touch with the NEORA team." }},
    privacy:  { ar:{ title:"سياسة الخصوصية — نيورا",                         desc:"سياسة الخصوصية الخاصة بنيورا." },
                en:{ title:"Privacy Policy — NEORA",                          desc:"NEORA's privacy policy." }},
    terms:    { ar:{ title:"شروط الاستخدام — نيورا",                          desc:"شروط وأحكام استخدام موقع نيورا." },
                en:{ title:"Terms of Use — NEORA",                            desc:"Terms and conditions for using NEORA." }},
    tool:     { ar:{ title:"تفاصيل الأداة — نيورا",                          desc:"مراجعة شاملة لأداة الذكاء الاصطناعي." },
                en:{ title:"Tool Details — NEORA",                            desc:"Comprehensive review of an AI tool." }},
  };

  // ── Core ──────────────────────────────────────────────────────────────────
  const STORAGE_KEY = "neora_lang";
  const SUPPORTED   = ["ar","en"];
  const DEFAULT     = "ar";
  let   currentLang = DEFAULT;

  function getLang() {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.includes(s) ? s : DEFAULT;
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
    if (!entry) { console.warn("[NEORA i18n] Missing key:", key); return key; }
    return entry[currentLang] || entry[DEFAULT] || key;
  }

  function applyLang(lang) {
    const isAr = lang === "ar";
    document.documentElement.dir  = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;

    // Translate all marked elements
    document.querySelectorAll("[data-i18n]").forEach(el => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      // Safe: only used for own content
      el.innerHTML = t(el.getAttribute("data-i18n-html")).replace(/\n/g,"<br>");
    });

    // SEO
    const pageKey = document.documentElement.getAttribute("data-page") || "home";
    const meta = pageMeta[pageKey]?.[lang];
    if (meta) {
      document.title = meta.title;
      let d = document.querySelector('meta[name="description"]');
      if (d) d.content = meta.desc;
      let ot = document.querySelector('meta[property="og:title"]');
      if (ot) ot.content = meta.title;
      let od = document.querySelector('meta[property="og:description"]');
      if (od) od.content = meta.desc;
    }

    // hreflang
    document.querySelectorAll('link[rel="alternate"]').forEach(l => l.remove());
    const base = window.location.href.split("?")[0];
    SUPPORTED.forEach(l => {
      const lnk = document.createElement("link");
      lnk.rel = "alternate"; lnk.hreflang = l;
      lnk.href = base + "?lang=" + l;
      document.head.appendChild(lnk);
    });

    // Active lang button
    document.querySelectorAll("[data-lang-btn]").forEach(btn => {
      btn.classList.toggle("on", btn.getAttribute("data-lang-btn") === lang);
    });

    // Dispatch for dynamic content
    document.dispatchEvent(new CustomEvent("neora:langchange", { detail:{ lang } }));
  }

  function init(pageKey) {
    if (pageKey) document.documentElement.setAttribute("data-page", pageKey);
    // URL param override
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    currentLang = (urlLang && SUPPORTED.includes(urlLang)) ? urlLang : getLang();
    if (urlLang && SUPPORTED.includes(urlLang)) {
      try { localStorage.setItem(STORAGE_KEY, urlLang); } catch {}
    }
    applyLang(currentLang);
    document.querySelectorAll("[data-lang-btn]").forEach(btn => {
      btn.addEventListener("click", () => setLang(btn.getAttribute("data-lang-btn")));
    });
  }

  return { init, setLang, getLang, t, applyLang, dict, pageMeta };
})();

// Auto-init on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => NeoraI18n.init());
} else {
  NeoraI18n.init();
}

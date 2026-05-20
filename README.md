# Twitter Analytics Tool - محلّل التغريدات الذكي

<div align="center">

![Version](https://img.shields.io/badge/version-3.0.0-cd7f32)
![License](https://img.shields.io/badge/license-MIT-blue)
![Language](https://img.shields.io/badge/language-Arabic%20%2F%20English-green)
![Platform](https://img.shields.io/badge/platform-Web-orange)
![Tests](https://img.shields.io/badge/tests-128%20passing-2da44e)

**تحليل عميق لتغريدة واحدة: كشف الذكاء الاصطناعي، توافقية خوارزمية X، وتوصيات للتحسين**

[العربية](#arabic) | [English](#english)

</div>

---

<a name="arabic"></a>
## 📋 نظرة عامة

**محلّل التغريدات الذكي v3.0** هو تطبيق ويب يُحلّل تغريدة واحدة على عمق متعدد الأبعاد: كشف احتمالية كون النص مكتوباً بالذكاء الاصطناعي، حساب توافقية النص مع خوارزمية X الجديدة ([xai-org/x-algorithm](https://github.com/xai-org/x-algorithm)) عبر 15 احتمال تفاعل، اقتراح إعادات صياغة محسّنة، ومقارنة A/B بين تغريدتين. يعمل التطبيق بالكامل محلياً في المتصفح بدون أي خادم — خصوصية كاملة.

### الميزات الجديدة في v3.0
- 🤖 **كشف الذكاء الاصطناعي**: 9 إشارات استدلالية + قاموس عبارات LLM (عربي/إنجليزي)
- 🐦 **توافقية خوارزمية X**: محرك تنبؤ بـ15 احتمال تفاعل (like, reply, repost, share, click, profile_click, video_view, photo_expand, dwell, follow, not_interested, block, mute, report, hide) وفق نموذج xai-org
- 🪄 **مُحسِّن ذكي**: 3 إعادات صياغة (أقصر/سؤال/أكثر إيجابية) مع درجة متوقعة جديدة
- 📊 **التفاعل المتوقع**: عرض احتمالات الإجراءات الـ15
- ✅ **فحص نقاط الضعف**: قائمة تحقّق قبل النشر
- 🎯 **كشف النبرة**: 6 فئات (رسمي/ودود/تعليمي/ترويجي/تحفيزي/تساؤلي) مع أفضل وقت للنشر
- ⚔️ **مقارنة A/B**: حقلان جنبيان لمقارنة تغريدتين
- 🗂️ **سجل التغريدات**: آخر 20 تحليلاً في localStorage
- 🖼️ **بطاقة مشاركة**: تصدير PNG بكل النتائج
- 🌓 **وضع داكن/فاتح** + تبديل لغة (AR/EN) محفوظ في localStorage

---

## ✨ المميزات الرئيسية

### 📊 إحصائيات شاملة
- **عدد التغريدات**: إحصاء تلقائي للتغريدات المحللة
- **إجمالي الكلمات**: حساب شامل لجميع الكلمات المستخدمة
- **متوسط الطول**: متوسط عدد الكلمات لكل تغريدة
- **عدد الهاشتاقات**: إحصاء الهاشتاقات الفريدة
- **عدد الإشارات**: حساب الحسابات المذكورة (@)
- **عدد الإيموجي**: إحصاء الرموز التعبيرية المستخدمة

### 🎭 تحليل المشاعر الذكي
- **تصنيف تلقائي**: إيجابي / محايد / سلبي
- **عرض مرئي**: شريط تفاعلي يوضح النسب المئوية
- **خوارزمية ذكية**: تحليل بناءً على الكلمات والإيموجي
- **دقة عالية**: تحديد المشاعر بشكل موثوق

### 💡 رؤى ذكية مخصصة
- **تحليل نمط الكتابة**: تقييم أسلوب التغريد (قصير/طويل)
- **استخدام الهاشتاقات**: تقييم فعالية الهاشتاقات
- **التفاعل الاجتماعي**: تحليل نمط الإشارات
- **نصائح تلقائية**: اقتراحات لتحسين المحتوى
- **تقييم الإيجابية**: قياس الطاقة الإيجابية في المحتوى

### 🏷️ تحليل الهاشتاقات
- **الترتيب الذكي**: أكثر 10 هاشتاقات استخداماً
- **عداد التكرار**: عدد مرات استخدام كل هاشتاق
- **عرض منظم**: بطاقات ملونة واضحة
- **تصنيف تلقائي**: ترتيب حسب الشعبية

### 👤 تحليل الإشارات (@)
- **استخراج تلقائي**: جميع الإشارات في التغريدات
- **الأكثر ذكراً**: ترتيب الحسابات حسب التكرار
- **عرض مرتب**: أفضل 10 حسابات مذكورة
- **إحصائيات دقيقة**: عدد مرات ذكر كل حساب

### 😊 تحليل الإيموجي
- **استخراج شامل**: جميع الرموز التعبيرية
- **عرض مرئي**: الإيموجي بحجم كبير وواضح
- **ترتيب الشعبية**: الأكثر استخداماً أولاً
- **عداد لكل رمز**: عدد مرات الاستخدام

### ☁️ سحابة الكلمات
- **25 كلمة**: أكثر الكلمات تكراراً
- **حجم ديناميكي**: حجم الكلمة يعكس تكرارها
- **تجاهل ذكي**: استبعاد الكلمات الشائعة (في، من، على...)
- **دعم ثنائي اللغة**: عربي وإنجليزي

### 📊 توزيع طول التغريدات
- **رسم بياني تفاعلي**: تصنيف بصري واضح
- **ثلاث فئات**: قصيرة (<50) / متوسطة (50-150) / طويلة (>150)
- **نسب مئوية**: عرض التوزيع بالنسب
- **ألوان مميزة**: تمييز بصري لكل فئة

### 🌟 أطول وأقصر التغريدات
- **عرض النصوص**: التغريدات كاملة
- **عدد الأحرف**: دقة في القياس
- **تمييز بصري**: إطارات ملونة
- **معلومات شاملة**: تفاصيل كل تغريدة

### 💾 تصدير البيانات (3 صيغ)
- **TXT 📥**: تقرير نصي شامل بتنسيق سهل القراءة
- **CSV 📊**: جدول بيانات مع تطهير RFC 4180 و UTF-8 BOM لـ Excel/العربية
- **JSON 🗂️**: بيانات منظّمة مع `generatedAt` و `version` للتكامل مع أدوات أخرى
- **ختم زمني**: تاريخ ووقت التحليل في كل ملف

### 💼 حفظ تلقائي
- **localStorage**: حفظ مؤجَّل لمحتوى الإدخال أثناء الكتابة
- **استعادة تلقائية**: عند فتح الأداة مجدداً، يُسترجع آخر إدخال
- **زر مسح 🗑️**: لتفريغ الإدخال والنتائج والتخزين بضغطة واحدة

### 📈 رسوم بيانية تفاعلية (SVG)
- **Donut chart**: مخطط دائري لتوزيع المشاعر
- **Bar chart**: رسم SVG حقيقي لتوزيع الأطوال مع تدرّج لوني
- **متجاوب**: يتكيف مع حجم الشاشة بدون فقدان جودة

---

## 🚀 كيفية الاستخدام

### 1️⃣ إدخال التغريدات
```
1. افتح الأداة في المتصفح
2. الصق تغريداتك في مربع النص
3. ضع كل تغريدة في سطر منفصل
4. يمكنك تضمين الهاشتاقات والإشارات والإيموجي
```

### 2️⃣ التحليل
```
1. انقر على زر "🔍 تحليل شامل"
2. انتظر ثوانٍ معدودة
3. شاهد النتائج الشاملة
4. استكشف جميع الإحصائيات والرؤى
```

### 3️⃣ التصدير
```
1. بعد التحليل، اختر صيغة التصدير:
   • TXT 📥 — تقرير نصي للقراءة والمشاركة
   • CSV 📊 — جدول للفتح في Excel أو Sheets
   • JSON 🗂️ — بيانات منظّمة للأتمتة
2. سيتم تحميل الملف تلقائياً
3. شارك أو احفظ النتائج
```

---

## 🎯 حالات الاستخدام

### 📱 للأفراد والمؤثرين
- **تحليل الأسلوب**: فهم نمط كتابتك
- **تحسين المحتوى**: رؤى لتطوير التغريدات
- **قياس الإيجابية**: معرفة مدى إيجابية محتواك
- **استراتيجية الهاشتاقات**: معرفة أكثر الهاشتاقات استخداماً

### 📊 للمسوقين ومديري المحتوى
- **تحليل الحملات**: فهم أداء المحتوى
- **استراتيجية الكلمات المفتاحية**: معرفة الكلمات الأكثر استخداماً
- **تحليل المشاعر**: قياس ردود الفعل
- **تقارير شاملة**: تصدير بيانات للعرض

### ✍️ للكتّاب والصحفيين
- **تحليل اللغة**: فهم الأسلوب اللغوي
- **قياس التنوع**: معرفة ثراء المفردات
- **إحصائيات دقيقة**: بيانات للأبحاث
- **توثيق المحتوى**: حفظ وتحليل التغريدات

### 🎓 للباحثين والأكاديميين
- **تحليل النصوص**: دراسة أنماط الكتابة
- **تحليل المشاعر**: أبحاث علمية
- **إحصائيات لغوية**: بيانات دقيقة
- **دراسات حالة**: أمثلة واقعية

### 🏢 للشركات والمؤسسات
- **تحليل العلامة التجارية**: فهم صوت العلامة
- **قياس الأداء**: تتبع المحتوى
- **تحسين الاستراتيجية**: رؤى قابلة للتنفيذ
- **تقارير للإدارة**: بيانات موثقة

---

## 🎨 التصميم والواجهة

### 🌙 نظام الألوان (مستوحى من Claude AI)
| العنصر | اللون | الوصف |
|--------|-------|-------|
| الخلفية الرئيسية | `#1d1d1f` | داكن ناعم |
| البطاقات | `#2a2a2c` | رمادي داكن |
| الحدود | `#3a3a3c` | رمادي فاتح |
| اللون الأساسي | `#cd7f32` | برونزي/ذهبي |
| النصوص | `#e8e8e8` | أبيض ناعم |
| النصوص الثانوية | `#a8a8a8` | رمادي فاتح |

### 📱 التصميم المتجاوب
- **Desktop**: تخطيط شبكي متعدد الأعمدة
- **Tablet**: تكيف تلقائي للشاشات المتوسطة
- **Mobile**: عرض عمودي محسّن للجوال
- **أحجام مرنة**: نصوص وعناصر تتكيف تلقائياً

### ✨ المؤثرات البصرية
- **انتقالات سلسة**: حركات ناعمة للعناصر
- **تأثيرات Hover**: استجابة عند التمرير
- **رسوم متحركة**: ظهور تدريجي للنتائج
- **ألوان ديناميكية**: تمييز بصري واضح

---

## 💻 المتطلبات التقنية

### المتصفحات المدعومة
- ✅ **Google Chrome** (موصى به)
- ✅ **Mozilla Firefox**
- ✅ **Microsoft Edge**
- ✅ **Safari**
- ✅ **Opera**
- ✅ أي متصفح حديث يدعم ES6

### الحد الأدنى من المواصفات
- متصفح حديث (2020 أو أحدث)
- JavaScript مفعّل
- دقة شاشة 320px × 568px أو أعلى
- اتصال بالإنترنت (لتحميل الصفحة فقط)

### الأداء
- **سرعة التحليل**: فوري (< 1 ثانية لـ 100 تغريدة)
- **الذاكرة**: استخدام خفيف للموارد
- **التوافق**: يعمل على جميع الأجهزة
- **الحجم**: ملف واحد خفيف

---

## 📊 البيانات المُحللة

### إحصائيات أساسية (6 بطاقات)
```
├── إجمالي التغريدات
├── إجمالي الكلمات
├── متوسط الطول
├── عدد الهاشتاقات
├── عدد الإشارات
└── عدد الإيموجي
```

### تحليلات متقدمة (8 أقسام)
```
├── 🎭 تحليل المشاعر (إيجابي/محايد/سلبي)
├── 💡 رؤى ذكية (نصائح مخصصة)
├── 🏷️ أبرز الهاشتاقات (أكثر 10)
├── 👤 الإشارات الأكثر تكراراً (أكثر 10)
├── 😊 الإيموجي المستخدمة (أكثر 10)
├── ☁️ سحابة الكلمات (25 كلمة)
├── 📊 توزيع طول التغريدات (رسم بياني)
└── 🌟 أطول وأقصر التغريدات
```

---

## 📂 تنسيق ملف التصدير

### محتوى الملف النصي
```text
📊 تقرير تحليل التغريدات
========================

📈 الإحصائيات العامة:
- إجمالي التغريدات: XX
- إجمالي الكلمات: XXX
- متوسط طول التغريدة: XX كلمة
- عدد الهاشتاقات: XX
- عدد الإشارات: XX
- عدد الإيموجي: XX

🎭 تحليل المشاعر:
- إيجابي: XX تغريدة
- محايد: XX تغريدة
- سلبي: XX تغريدة

🏷️ أبرز الهاشتاقات:
- #هاشتاق1: XX مرة
- #هاشتاق2: XX مرة
...

[جميع الأقسام الأخرى]

========================
تم إنشاء التقرير بواسطة أداة تحليل التغريدات
[التاريخ والوقت]
```

---

## 🔒 الخصوصية والأمان

### ✅ ضمانات الخصوصية
- **معالجة محلية**: جميع العمليات في متصفحك
- **بدون خوادم**: لا يتم إرسال بيانات لأي خادم
- **بدون تتبع**: لا توجد أكواد تتبع
- **بدون ملفات تعريف**: لا استخدام للكوكيز
- **حفظ محلي فقط**: localStorage على جهازك حصراً، يمكن مسحه بزر "🗑️ مسح"

### 🛡️ الأمان
- **كود شفاف**: مفتوح المصدر للمراجعة
- **بدون API**: لا اتصالات خارجية
- **حماية XSS**: جميع المخرجات تستخدم `textContent` بدون `innerHTML` للبيانات المستخدم
- **آمن تماماً**: مناسب للبيانات الحساسة
- **اختبارات أمنية**: 95 اختبار آلي يشمل فحص XSS صريح

---

## 🛠️ التقنيات المستخدمة

### Frontend (Runtime)
```
├── HTML5: البنية الدلالية + ARIA
├── CSS3: التصميم والتنسيق
│   ├── Flexbox + Grid: التخطيطات
│   ├── Clamp(): أحجام مرنة
│   ├── prefers-reduced-motion: الوصولية
│   └── Animations: انتقالات سلسة
├── JavaScript (Vanilla ES Modules)
│   ├── DOM Manipulation (آمن — بدون innerHTML للبيانات)
│   ├── RegEx + Unicode word boundaries
│   ├── Map / Set: عدّ الكلمات وتسريع البحث
│   ├── Blob API: تصدير الملفات
│   ├── localStorage: حفظ الإدخال محلياً
│   └── i18n: ar.js / en.js
└── SVG: رسوم بيانية تفاعلية (donut + bars)
```

### Dev tooling (لا تُضمَّن في الـ runtime)
```
├── Vite — dev server + production build
├── Vitest + jsdom — 95 اختبار آلي
├── ESLint — linting
└── Prettier — تنسيق الكود
```

### بدون runtime dependencies
- ✅ بدون jQuery / React / Bootstrap
- ✅ كل ما يصل المتصفح هو HTML/CSS/JS وحدها (~22KB JS مضغوط)

---

## 📝 أمثلة الاستخدام

### مثال 1: تحليل تغريدات شخصية
```
Input:
أحب البرمجة والتطوير 😍 #برمجة
اليوم تعلمت شيئاً جديداً 🎉
@محمد شكراً على المساعدة 🙏

Output:
✅ 3 تغريدات
✅ 12 كلمة
✅ متوسط 4 كلمات
✅ 1 هاشتاق (#برمجة)
✅ 1 إشارة (@محمد)
✅ 3 إيموجي
✅ مشاعر: 100% إيجابية
```

### مثال 2: تحليل حملة تسويقية
```
Input:
عرض خاص! خصم 50% #عروض #تخفيضات
تسوق الآن واحصل على هدية مجانية 🎁
لا تفوت الفرصة #تسوق #عروض

Output:
✅ 3 تغريدات
✅ 14 كلمة
✅ 4 هاشتاقات فريدة
✅ #عروض: الأكثر تكراراً (2 مرة)
✅ كلمات مفتاحية: عرض، خصم، تسوق
```

---

## 🔧 التخصيص والتطوير

### تعديل الألوان
```css
/* في styles/main.css */
body {
    background: #your-color; /* لون الخلفية */
}
.btn {
    background: #your-color; /* لون الأزرار */
}
```

### تعديل الكلمات المستبعدة
```javascript
// في src/data/stopwords.js
export const STOP_WORDS = new Set([
    'في', 'من', 'إلى', 'على', // أضف كلماتك
]);
```

### تعديل كلمات المشاعر
```javascript
// في src/data/sentiment-dict.js
export const POSITIVE_WORDS = new Set([
    'رائع', 'جميل', // أضف كلمات إيجابية
]);
export const NEGATIVE_WORDS = new Set([
    'سيء', 'حزين', // أضف كلمات سلبية
]);
```

---

## 📖 الأسئلة الشائعة

### ❓ هل الأداة مجانية؟
**نعم**، الأداة مجانية بالكامل للاستخدام الشخصي والتجاري.

### ❓ هل أحتاج Twitter API؟
**لا**، الأداة تعمل بدون API. انسخ تغريداتك والصقها مباشرة.

### ❓ هل بياناتي آمنة؟
**نعم**، جميع العمليات محلية في متصفحك. لا يتم إرسال أي شيء للإنترنت.

### ❓ كم عدد التغريدات المدعومة؟
**غير محدود**، لكن يُنصح بـ 100-500 تغريدة للأداء الأمثل.

### ❓ هل تدعم الأداة الإنجليزية؟
**نعم**، التحليل يدعم العربية والإنجليزية معاً.

### ❓ هل يمكن حفظ التحليل؟
**نعم**، يمكنك التصدير بثلاث صيغ: TXT للقراءة، CSV للجداول، و JSON للأتمتة.

### ❓ هل يُحفظ إدخالي تلقائياً؟
**نعم**، يُحفظ نص الإدخال محلياً في متصفحك (localStorage) ويُستعاد عند الفتح القادم. يمكن مسحه بزر "🗑️ مسح".

### ❓ هل تعمل على الجوال؟
**نعم**، الأداة متجاوبة بالكامل وتعمل على جميع الأجهزة.

### ❓ كيف أحصل على تغريداتي من تويتر؟
1. افتح حسابك على تويتر
2. اذهب لملفك الشخصي
3. انسخ التغريدات يدوياً
4. أو استخدم أدوات النسخ المساعدة

---

## 🚀 التثبيت والاستخدام

### طريقة 1: استخدام مباشر (للمستخدمين)
افتح: https://abosalehg-ui.github.io/twitter-analyzer/

### طريقة 2: التشغيل محلياً للتطوير
```bash
git clone https://github.com/abosalehg-ui/twitter-analyzer.git
cd twitter-analyzer
npm install
npm run dev        # http://localhost:5173
```

### طريقة 3: بناء للإنتاج
```bash
npm run build      # ينتج dist/
npm run preview    # معاينة dist/ محلياً
```

---

## 🧑‍💻 للمطورين

### بنية المشروع
```
twitter-analyzer/
├── index.html                  ← markup فقط + <script type="module">
├── styles/main.css             ← CSS مستخرج
├── src/
│   ├── main.js                 ← entry point
│   ├── analysis/               ← منطق التحليل الخالص (قابل للاختبار)
│   │   ├── tokenize.js
│   │   ├── sentiment.js
│   │   ├── extractors.js
│   │   ├── stats.js
│   │   └── index.js
│   ├── render/                 ← طبقة العرض (DOM آمن + SVG)
│   │   ├── dom.js              ← el() helper آمن من XSS
│   │   ├── sections.js
│   │   ├── insights.js
│   │   └── charts.js           ← SVG donut + bars
│   ├── export/                 ← TXT / CSV / JSON
│   ├── i18n/                   ← ar.js / en.js / index.js
│   ├── data/                   ← stopwords + sentiment-dict
│   └── storage/local.js        ← localStorage
├── tests/                      ← 95 اختبار Vitest
└── .github/workflows/deploy.yml ← نشر تلقائي على Pages
```

### الـ npm scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | تشغيل dev server مع HMR |
| `npm run build` | بناء الإنتاج إلى `dist/` |
| `npm run preview` | معاينة `dist/` محلياً |
| `npm test` | تشغيل 95 اختبار مرة واحدة |
| `npm run test:watch` | اختبارات في وضع watch |
| `npm run test:coverage` | تقرير تغطية الاختبارات |
| `npm run lint` | فحص ESLint |
| `npm run format` | تنسيق الكود بـ Prettier |

### النشر
كل push على `main` يشغّل `.github/workflows/deploy.yml` الذي:
1. ينفّذ الاختبارات (يمنع نشر كود مكسور)
2. يبني المشروع بـ Vite
3. ينشر `dist/` تلقائياً على GitHub Pages

---

## 📄 الترخيص

```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤝 المساهمة

نرحب بمساهماتكم لتطوير الأداة! 

### كيفية المساهمة
1. **Fork** المشروع
2. أنشئ **Branch** للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. **Commit** التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. **Push** للـ Branch (`git push origin feature/AmazingFeature`)
5. افتح **Pull Request**

### أفكار للمساهمة
- [ ] إضافة لغات جديدة
- [ ] تحسين خوارزمية تحليل المشاعر
- [ ] إضافة رسوم بيانية Chart.js
- [ ] تحليل الوقت والتاريخ
- [ ] تصدير PDF
- [ ] Dark/Light Mode Toggle
- [ ] حفظ التاريخ في LocalStorage
- [ ] مقارنة بين عدة تحليلات

---

## 🔄 سجل التحديثات

### الإصدار 1.0.0 (ديسمبر 2024)
- ✅ الإطلاق الأول
- ✅ 6 إحصائيات أساسية
- ✅ 8 تحليلات متقدمة
- ✅ تحليل المشاعر
- ✅ رؤى ذكية
- ✅ تحليل الهاشتاقات والإشارات
- ✅ سحابة الكلمات
- ✅ تحليل الإيموجي
- ✅ توزيع الطول
- ✅ تصدير TXT
- ✅ تصميم متجاوب
- ✅ واجهة Claude AI Style

---

## 🌟 الميزات المستقبلية

### قيد التطوير
- [ ] تحليل التواريخ والأوقات
- [ ] رسوم بيانية تفاعلية
- [ ] مقارنة تحليلات متعددة
- [ ] تصدير PDF/Excel
- [ ] حفظ في LocalStorage
- [ ] وضع الليل/النهار
- [ ] اختصارات لوحة المفاتيح
- [ ] استيراد من ملفات

### خطط طويلة المدى
- [ ] تطبيق Progressive Web App (PWA)
- [ ] تحليل الصور في التغريدات
- [ ] AI-Powered Insights
- [ ] دعم منصات أخرى (Instagram, LinkedIn)
- [ ] API للمطورين
- [ ] تطبيق سطح المكتب (Electron)

---

## 👨‍💻 المطور

**تطوير: [عبدالكريم العبود]**

📧 البريد الإلكتروني: [abo.saleh.g@gmail.com](mailto:abo.saleh.g@gmail.com)  
🌐 الموقع: [هنا](https://abosalehg-ui.github.io/twitter-analyzer)  
💻 GitHub: [abosalehg-ui](https://github.com/abosalehg-ui)

---

## 📞 الدعم والمساعدة

### طرق التواصل
- 📧 **Email**: abo.saleh.g@gmail.com
- 💬 **Issues**: [GitHub Issues](https://github.com/abosalehg-ui/twitter-analytics/issues)
- 📖 **Documentation**: [Wiki](https://github.com/abosalehg-ui/twitter-analytics/wiki)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/abosalehg-ui/twitter-analytics/discussions)

### الإبلاغ عن مشكلة
```markdown
**وصف المشكلة:**
[وصف واضح للمشكلة]

**خطوات إعادة الإنتاج:**
1. اذهب إلى '...'
2. انقر على '...'
3. الخطأ يظهر

**السلوك المتوقع:**
[ما كان يجب أن يحدث]

**لقطات الشاشة:**
[إن وُجدت]

**المتصفح:**
- OS: [مثال: Windows 10]
- Browser: [مثال: Chrome 120]
```

---

## 📊 إحصائيات المشروع

![GitHub Stars](https://img.shields.io/github/stars/yourusername/twitter-analytics?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/twitter-analytics?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/twitter-analytics)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/yourusername/twitter-analytics)

---

<a name="english"></a>
# English Documentation

## 📋 Overview

**Twitter Analytics Tool** is a comprehensive web application that provides deep analysis of tweets without requiring Twitter API access. The tool operates locally in your browser and fully respects your privacy - no data is sent to external servers. Designed with a modern interface inspired by Claude AI with responsive design that works on all devices.

---

## ✨ Key Features

### 📊 Comprehensive Statistics
- **Tweet Count**: Automatic count of analyzed tweets
- **Total Words**: Complete calculation of all used words
- **Average Length**: Average word count per tweet
- **Hashtag Count**: Count of unique hashtags
- **Mention Count**: Number of mentioned accounts (@)
- **Emoji Count**: Count of emojis used

### 🎭 Smart Sentiment Analysis
- **Automatic Classification**: Positive / Neutral / Negative
- **Visual Display**: Interactive bar showing percentages
- **Smart Algorithm**: Analysis based on words and emojis
- **High Accuracy**: Reliable sentiment detection

### 💡 Personalized Smart Insights
- **Writing Style Analysis**: Assessment of tweeting style (short/long)
- **Hashtag Usage**: Evaluation of hashtag effectiveness
- **Social Interaction**: Mention pattern analysis
- **Automatic Tips**: Suggestions for content improvement
- **Positivity Rating**: Measure of positive energy in content

### 🏷️ Hashtag Analysis
- **Smart Ranking**: Top 10 most used hashtags
- **Frequency Counter**: Number of uses per hashtag
- **Organized Display**: Clear colored cards
- **Automatic Sorting**: Ranked by popularity

### 👤 Mention Analysis (@)
- **Automatic Extraction**: All mentions in tweets
- **Most Mentioned**: Accounts ranked by frequency
- **Sorted Display**: Top 10 mentioned accounts
- **Accurate Statistics**: Number of mentions per account

### 😊 Emoji Analysis
- **Comprehensive Extraction**: All emojis
- **Visual Display**: Large and clear emojis
- **Popularity Ranking**: Most used first
- **Per-Symbol Counter**: Usage count for each

### ☁️ Word Cloud
- **25 Words**: Most frequently repeated words
- **Dynamic Size**: Word size reflects frequency
- **Smart Filtering**: Exclude common words (in, from, on...)
- **Bilingual Support**: Arabic and English

### 📊 Tweet Length Distribution
- **Interactive Chart**: Clear visual classification
- **Three Categories**: Short (<50) / Medium (50-150) / Long (>150)
- **Percentages**: Distribution shown in percentages
- **Distinctive Colors**: Visual distinction for each category

### 🌟 Longest and Shortest Tweets
- **Text Display**: Complete tweets
- **Character Count**: Precise measurement
- **Visual Distinction**: Colored frames
- **Comprehensive Information**: Details for each tweet

### 💾 Data Export (3 formats)
- **TXT 📥**: Comprehensive text report, easy to read
- **CSV 📊**: Spreadsheet-ready with RFC 4180 escaping and UTF-8 BOM (Excel/Arabic compatible)
- **JSON 🗂️**: Structured payload with `generatedAt` + `version` for automation
- **Timestamp**: Date and time recorded in every file

### 💼 Auto-save
- **localStorage**: debounced save of your textarea content while typing
- **Auto-restore**: last input is restored when you reopen the tool
- **Clear button 🗑️**: wipes input, results, and storage in one click

### 📈 Interactive Charts (SVG)
- **Donut chart**: sentiment distribution as a real SVG donut
- **Bar chart**: SVG length-distribution chart with gradient fill
- **Responsive**: scales without losing quality

---

## 🚀 How to Use

### 1️⃣ Input Tweets
```
1. Open the tool in browser
2. Paste your tweets in the text box
3. Put each tweet on a separate line
4. You can include hashtags, mentions, and emojis
```

### 2️⃣ Analysis
```
1. Click "🔍 Comprehensive Analysis" button
2. Wait a few seconds
3. View comprehensive results
4. Explore all statistics and insights
```

### 3️⃣ Export
```
1. After analysis, pick a format:
   • TXT 📥 — readable text report
   • CSV 📊 — spreadsheet for Excel / Sheets
   • JSON 🗂️ — structured data for automation
2. File downloads automatically
3. Share or save results
```

---

## 🎯 Use Cases

### 📱 For Individuals and Influencers
- **Style Analysis**: Understand your writing pattern
- **Content Improvement**: Insights to develop tweets
- **Positivity Measurement**: Know how positive your content is
- **Hashtag Strategy**: Know most used hashtags

### 📊 For Marketers and Content Managers
- **Campaign Analysis**: Understand content performance
- **Keyword Strategy**: Know most used words
- **Sentiment Analysis**: Measure reactions
- **Comprehensive Reports**: Export data for presentation

### ✍️ For Writers and Journalists
- **Language Analysis**: Understand linguistic style
- **Diversity Measurement**: Know vocabulary richness
- **Accurate Statistics**: Data for research
- **Content Documentation**: Save and analyze tweets

### 🎓 For Researchers and Academics
- **Text Analysis**: Study writing patterns
- **Sentiment Analysis**: Scientific research
- **Linguistic Statistics**: Accurate data
- **Case Studies**: Real examples

### 🏢 For Companies and Organizations
- **Brand Analysis**: Understand brand voice
- **Performance Measurement**: Track content
- **Strategy Improvement**: Actionable insights
- **Management Reports**: Documented data

---

## 💻 Technical Requirements

### Supported Browsers
- ✅ **Google Chrome** (Recommended)
- ✅ **Mozilla Firefox**
- ✅ **Microsoft Edge**
- ✅ **Safari**
- ✅ **Opera**
- ✅ Any modern browser supporting ES6

### Minimum Specifications
- Modern browser (2020 or newer)
- JavaScript enabled
- Screen resolution 320px × 568px or higher
- Internet connection (for page load only)

### Performance
- **Analysis Speed**: Instant (< 1 second for 100 tweets)
- **Memory**: Light resource usage
- **Compatibility**: Works on all devices
- **Size**: Single lightweight file

---

## 🔒 Privacy and Security

### ✅ Privacy Guarantees
- **Local Processing**: All operations in your browser
- **No Servers**: No data sent to any server
- **No Tracking**: No tracking codes
- **No Cookies**: No cookie usage
- **Local-only storage**: input persisted to localStorage on your device only; clearable via the 🗑️ Clear button

### 🛡️ Security
- **Transparent Code**: Open source for review
- **No API**: No external connections
- **XSS-hardened**: all user data rendered via `textContent`; no `innerHTML` for user input
- **Completely Safe**: Suitable for sensitive data
- **Tested**: 95 automated tests including an explicit XSS guard

---

## 🛠️ Technologies Used

### Frontend (Runtime)
```
├── HTML5: semantic markup + ARIA
├── CSS3: layout and styling
│   ├── Flexbox + Grid
│   ├── Clamp(): fluid sizes
│   ├── prefers-reduced-motion: a11y
│   └── Animations
├── JavaScript (Vanilla ES Modules)
│   ├── Safe DOM (no innerHTML for user data)
│   ├── RegEx + Unicode word boundaries
│   ├── Map / Set: counting & fast lookup
│   ├── Blob API: file export
│   ├── localStorage: input persistence
│   └── i18n: ar.js / en.js
└── SVG: interactive charts (donut + bars)
```

### Dev tooling (not shipped to the browser)
```
├── Vite — dev server + production build
├── Vitest + jsdom — 95 automated tests
├── ESLint — linting
└── Prettier — code formatting
```

### No runtime dependencies
- ✅ No jQuery / React / Bootstrap
- ✅ Only HTML/CSS/JS ship to the browser (~22KB JS gzipped)

---

## 🚀 Installation and Usage

### Method 1: Use directly (end users)
Open: https://abosalehg-ui.github.io/twitter-analyzer/

### Method 2: Run locally (developers)
```bash
git clone https://github.com/abosalehg-ui/twitter-analyzer.git
cd twitter-analyzer
npm install
npm run dev        # http://localhost:5173
```

### Method 3: Production build
```bash
npm run build      # outputs to dist/
npm run preview    # preview dist/ locally
```

---

## 🧑‍💻 For Developers

### Project structure
```
twitter-analyzer/
├── index.html                  ← markup only + <script type="module">
├── styles/main.css             ← extracted CSS
├── src/
│   ├── main.js                 ← entry point
│   ├── analysis/               ← pure analysis logic (testable)
│   ├── render/                 ← DOM + SVG rendering (XSS-safe)
│   ├── export/                 ← TXT / CSV / JSON
│   ├── i18n/                   ← ar.js / en.js / index.js
│   ├── data/                   ← stopwords + sentiment-dict
│   └── storage/local.js        ← localStorage
├── tests/                      ← 95 Vitest tests
└── .github/workflows/deploy.yml ← auto-deploy to Pages
```

### npm scripts
| Script | Description |
|--------|-------------|
| `npm run dev` | dev server with HMR |
| `npm run build` | production build to `dist/` |
| `npm run preview` | preview `dist/` locally |
| `npm test` | run 95 tests once |
| `npm run test:watch` | tests in watch mode |
| `npm run test:coverage` | coverage report |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier formatting |

### Deployment
Every push to `main` triggers `.github/workflows/deploy.yml`, which:
1. Runs the test suite (prevents shipping broken code)
2. Builds with Vite
3. Deploys `dist/` to GitHub Pages

---

## 📄 License

```
MIT License

Copyright (c) 2024 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤝 Contributing

We welcome your contributions to improve the tool!

### How to Contribute
1. **Fork** the project
2. Create a **Branch** for new feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to Branch (`git push origin feature/AmazingFeature`)
5. Open a **Pull Request**

### Contribution Ideas
- [ ] Add new languages
- [ ] Improve sentiment analysis algorithm
- [ ] Add Chart.js visualizations
- [ ] Time and date analysis
- [ ] PDF export
- [ ] Dark/Light Mode Toggle
- [ ] Save history in LocalStorage
- [ ] Compare multiple analyses

---

## 🔄 Changelog

### Version 1.0.0 (December 2024)
- ✅ Initial release
- ✅ 6 basic statistics
- ✅ 8 advanced analyses
- ✅ Sentiment analysis
- ✅ Smart insights
- ✅ Hashtag and mention analysis
- ✅ Word cloud
- ✅ Emoji analysis
- ✅ Length distribution
- ✅ TXT export
- ✅ Responsive design
- ✅ Claude AI Style interface

---

## 🌟 Future Features

### In Development
- [ ] Date and time analysis
- [ ] Interactive charts
- [ ] Compare multiple analyses
- [ ] PDF/Excel export
- [ ] LocalStorage saving
- [ ] Day/Night mode
- [ ] Keyboard shortcuts
- [ ] Import from files

### Long-term Plans
- [ ] Progressive Web App (PWA)
- [ ] Image analysis in tweets
- [ ] AI-Powered Insights
- [ ] Support other platforms (Instagram, LinkedIn)
- [ ] Developer API
- [ ] Desktop app (Electron)

---

## 👨‍💻 Developer

**Developed by: [ABDULKARIM ALOBUD]**

📧 Email: [abo.saleh.g@gmail.com](mailto:abo.saleh.g@gmail.com)  
🌐 Website: [In here](https://abosalehg-ui.github.io/twitter-analyzer)  
💻 GitHub: [abosalehg-ui](https://github.com/abosalehg-ui)

---

## 📞 Support and Help

### Contact Methods
- 📧 **Email**: abo.saleh.g@gmail.com
- 💬 **Issues**: [GitHub Issues](https://github.com/abosalehg-ui/twitter-analytics/issues)
- 📖 **Documentation**: [Wiki](https://github.com/abosalehg-ui/twitter-analytics/wiki)
- 💡 **Discussions**: [GitHub Discussions](https://github.com/abosalehg-ui/twitter-analytics/discussions)

---

<div align="center">

### 🌐 Links

[🏠 Homepage](https://abosalehg-ui.github.io/twitter-analyzer) | 
[📖 Documentation](https://github.com/abosalehg-ui/twitter-analytics-tool/wiki) | 
[🐛 Report Bug](https://github.com/abosalehg-ui/twitter-analytics-tool/issues) | 
[✨ Request Feature](https://github.com/abosalehg-ui/twitter-analytics-tool/issues)

---

**Twitter Analytics Tool** - Intelligence in Every Tweet

Made with ❤️ by [ABDULKARIM]

⭐ Star us on GitHub if you find this useful!

---

![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

</div>

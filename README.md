# محلّل التغريدات الذكي · Smart Tweet Analyzer

<div align="center">

![Version](https://img.shields.io/badge/version-3.0.2-cd7f32)
![License](https://img.shields.io/badge/license-MIT-blue)
![Language](https://img.shields.io/badge/language-Arabic%20%2F%20English-green)
![Platform](https://img.shields.io/badge/platform-Web-orange)
[![CI](https://github.com/abosalehg-ui/twitter-analyzer/actions/workflows/ci.yml/badge.svg)](https://github.com/abosalehg-ui/twitter-analyzer/actions/workflows/ci.yml)

**تحليل عميق لتغريدة واحدة: كشف الذكاء الاصطناعي، توافقية خوارزمية X، وتوصيات للتحسين**

_Single-tweet deep diagnostics: AI detection, X-algorithm fit, and improvement suggestions_

[العربية](#arabic) · [English](#english) · [🌐 Live Demo](https://abosalehg-ui.github.io/twitter-analyzer)

</div>

---

<a name="arabic"></a>

## 📋 نظرة عامة

**محلّل التغريدات الذكي v3.0** تطبيق ويب يُحلّل تغريدة واحدة عبر **8 أبعاد تشخيصية** بدون أي خادم أو API خارجي. كل المعالجة تتم محلياً في متصفحك.

### ما الجديد في v3.0؟

- 🤖 **كشف الذكاء الاصطناعي**: 9 إشارات استدلالية موزونة تُقدّر احتمالية كون النص مكتوباً بـ LLM
- 🐦 **توافقية خوارزمية X**: محرك تنبؤ استدلالي مستوحى من بنية [`xai-org/x-algorithm`](https://github.com/xai-org/x-algorithm) يقدّر درجة التوافق عبر 15 احتمال تفاعل
- 🪄 **مُحسِّن ذكي**: 3 إعادات صياغة (أقصر / سؤال / إيجابي) مع درجة جديدة متوقعة لكل واحدة
- ⚔️ **مقارنة A/B** بين تغريدتين
- 🗂️ **سجل التحليلات** (آخر 20)
- 🖼️ **بطاقة مشاركة PNG** بكل النتائج

---

## ✨ الميزات بالتفصيل

### 🤖 كشف الذكاء الاصطناعي

نتيجة 0-100 مع مستوى ثقة (low/medium/high يعتمد على طول النص). تعتمد على 9 إشارات موزونة:

| الإشارة | الوزن | الفكرة |
|---|---|---|
| تباين أطوال الجمل (Burstiness) | 18% | LLM تنتج جملاً منتظمة، البشر يتفاوتون |
| تنوّع المفردات (TTR) | 14% | TTR مرتفع جداً على نص قصير = مشبوه |
| الرسمية | 12% | نسبة الكلمات الطويلة (≥7 أحرف) |
| دقة الترقيم | 12% | em-dash، علامات تنصيص ذكية، semicolons |
| عبارات LLM شائعة | 15% | قاموس عربي/إنجليزي (~80 عبارة: "delve", "furthermore", "في الواقع", "تجدر الإشارة"...) |
| كثافة الإيموجي | 8% | غياب الإيموجي على نص طويل = مشبوه |
| غياب الـ slang/typos | 8% | "lol", "يلا", "ngl" = إشارات بشرية قوية |
| نمط الهاشتاقات | 7% | تجميعها في النهاية بترتيب صارم = LLM |
| بدايات الجمل | 6% | تكرار "In/As/While/إن/مع" |

> ⚠️ **إخلاء مسؤولية**: تقدير استدلالي وليس حكماً قطعياً — حتى الأدوات التجارية تخطئ في النصوص القصيرة كالتغريدات.

### 🐦 توافقية خوارزمية X

> ⚠️ **ما هي وما ليست**: هذه الدرجة **تقدير استدلالي** مستوحى من بنية الأوزان التي تعلنها [`xai-org/x-algorithm`](https://github.com/xai-org/x-algorithm) — **وليست** نموذج X الفعلي ولا مخرجاته. الأوزان الحقيقية غير منشورة، فالأوزان هنا (`src/data/algorithm-weights.js`) والاحتمالات (`predictProbabilities()`) قيم يدوية مُعايَرة تحترم المبدأ المعلن فقط: الإجراءات الإيجابية بأوزان موجبة، والسلبية بأوزان سالبة أكبر حجماً.

يقدّر المحرك **15 احتمالاً للتفاعل** ويجمعها وفق المعادلة:

```
Final Score = Σ (weight_i × P(action_i))
```

| الإجراءات الإيجابية | الإجراءات السلبية |
|---|---|
| like, reply, repost, share | not_interested, hide |
| click, profile_click | block_author, mute_author |
| video_view, photo_expand | report |
| dwell, follow | |

**النتيجة**: درجة 0-100 + تصنيف الوصول المتوقع (منخفض/متوسط/جيد/ممتاز) + توصيات قابلة للتنفيذ.

**العوامل المؤثرة (استدلالية)**:
- ✅ المنطقة المثلى للطول (70-150 حرف) → bonus
- ✅ وجود سؤال يحفّز الـ replies (وزن عالٍ)
- ✅ النبرة الإيجابية والإيموجي المعتدل
- ❌ الروابط الخارجية → خصم
- ❌ Engagement bait ("RT to win", "اشترك ولايك") → خصم كبير
- ❌ النبرة السامة (تُحفّز block/mute/report)
- ❌ الهاشتاقات/الإشارات المفرطة

### 🪄 مُحسِّن التغريدة

يقترح **3 إعادات صياغة** مع تقدير الدرجة الجديدة:

1. **أقصر**: حذف الحشو والاختصار للمنطقة المثلى
2. **سؤال**: إضافة "ما رأيكم؟ / what do you think?" لتحفيز الردود
3. **إيجابي**: استبدال الكلمات السلبية + علامة إيجابية

### 📊 لوحات التحليل الـ8 (Tabs)

| التبويب | المحتوى |
|---|---|
| **نظرة عامة** | 3 مؤشرات دائرية (gauges) + إحصاءات سريعة |
| **كشف AI** | الدرجة + 9 إشارات مفصّلة + العبارات المكتشفة |
| **توافقية X** | الدرجة + أهم 5 إيجابيات + أسوأ 3 سلبيات + توصيات |
| **التفاعل المتوقع** | الـ15 احتمالاً ببارات نسبية |
| **تحسين** | بطاقات إعادة الصياغة |
| **نقاط الضعف** | قائمة تحقّق من 10 معايير قبل النشر |
| **النبرة** | الفئة المكتشفة + أفضل وقت للنشر + مؤشر القراءة |
| **تفاصيل** | كلمات مفتاحية + هاشتاقات + إشارات + إيموجي |

### 🎚️ صندوق التغريدة الذكي

- **عدّاد دائري** ملوّن (أخضر في الـ sweet-spot، أصفر عند 240، أحمر عند 280+)
- **شريط تقدّم** مع منطقة 70-150 مُميَّزة
- **اختصارات لوحة المفاتيح**: `Cmd/Ctrl+Enter` للتحليل · `Esc` للمسح
- **حفظ تلقائي** للمسودة في localStorage
- **حد 280 حرفاً** مع تحذير سلس

### ⚔️ مقارنة A/B

بعد تحليل تغريدة، اضغط زر "⚔️ قارن مع تغريدة أخرى" → يفتح composer ثانٍ → يعرض جدولاً جنبياً يوضّح الأفضل في كل معيار.

### 🗂️ السجل + 🖼️ بطاقة المشاركة

- **سجل**: آخر 20 تحليلاً في localStorage مع زر فتح/مقارنة/حذف
- **بطاقة PNG**: تصدير canvas-based بحجم 1200×630 مناسب للمشاركة على المنصات

### 🌐 ثنائية اللغة + Theme

- **AR/EN** يقلب `dir="rtl"` ↔ `dir="ltr"` ويحدّث كل النصوص ديناميكياً
- **Dark/Light** قابل للتبديل مع حفظ التفضيل
- **ARIA كاملة** (tablist/tab/tabpanel) + `prefers-reduced-motion`

### 💾 التصدير

| الصيغة | المحتوى |
|---|---|
| **TXT 📥** | تقرير نصي مقروء |
| **CSV 📊** | RFC 4180 + UTF-8 BOM لـ Excel/العربية + احتمالات الـ15 |
| **JSON 🗂️** | بيانات منظّمة v3 schema للأتمتة |
| **PNG 🖼️** | بطاقة مشاركة بصرية |

---

## 🔒 الخصوصية والأمان

- ✅ **Client-side بالكامل**: لا خادم، لا API، لا تتبّع، لا كوكيز
- ✅ **localStorage محلي فقط**: المسودة + السجل + التفضيلات كلها على جهازك
- ✅ **XSS-hardened**: كل بيانات المستخدم تُعرض عبر `textContent` — لا `innerHTML`
- ✅ **162 اختبار** بما فيها حارس XSS صريح وحارس لصحة القواميس العربية
- ✅ **مفتوح المصدر** بالكامل تحت رخصة MIT

---

## 🚀 الاستخدام

### المستخدمون
🌐 افتح: **https://abosalehg-ui.github.io/twitter-analyzer**

### المطورون

```bash
git clone https://github.com/abosalehg-ui/twitter-analyzer.git
cd twitter-analyzer
npm install
npm run dev           # http://localhost:5173
```

### الإنتاج

```bash
npm run build         # → dist/
npm run preview       # معاينة dist/
```

---

## 🧑‍💻 للمطورين

### بنية المشروع

```
src/
├── analysis/
│   ├── ai-detection.js          ← كشف AI (9 إشارات)
│   ├── algorithm-score.js       ← توافقية X
│   ├── engagement-predictor.js  ← تنبؤ بـ15 إجراء
│   ├── readability.js           ← مؤشر LIX المعدّل
│   ├── tone-detector.js         ← 6 نبرات
│   ├── single-tweet.js          ← orchestrator
│   ├── normalize.js             ← تطبيع عربي موحّد (للنص والقواميس)
│   ├── sentiment.js / extractors.js / tokenize.js
│   └── index.js
├── data/
│   ├── ai-cliches.js            ← قاموس عبارات LLM
│   ├── algorithm-weights.js     ← أوزان استدلالية (مستوحاة من xai-org)
│   ├── bait-patterns.js         ← engagement-bait
│   ├── sensitive-words.js       ← toxicity/spam
│   ├── tone-patterns.js
│   ├── sentiment-dict.js / stopwords.js
├── optimizer/
│   └── rewrite-suggestions.js   ← 3 variants
├── render/
│   ├── composer.js, tabs.js, panels.js, toast.js,
│   │ history-panel.js, comparison.js, share-card.js, dom.js
├── storage/
│   ├── history.js, preferences.js, local.js
├── i18n/
│   ├── ar.js, en.js, index.js
├── export/
│   ├── txt.js, csv.js, json.js, download.js
└── main.js                       ← entry point
```

### npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | بناء إنتاجي إلى `dist/` |
| `npm run preview` | معاينة `dist/` |
| `npm test` | 162 اختبار (vitest + jsdom) |
| `npm run test:watch` | watch mode |
| `npm run test:coverage` | تقرير تغطية |
| `npm run lint` | ESLint |
| `npm run typecheck` | فحص الأنواع عبر JSDoc (`tsc`، بلا إخراج) |
| `npm run format` | Prettier |

### النشر

كل push على `main` يُفعّل `.github/workflows/deploy.yml` الذي:
1. يشغّل الاختبارات
2. يبني عبر Vite
3. ينشر `dist/` إلى GitHub Pages تلقائياً

### الاختبارات (162 ✅)

| ملف | محتوى |
|---|---|
| `ai-detection.test.js` | الإشارات + النتيجة الكلية |
| `algorithm-score.test.js` | الـ15 احتمالاً + التوصيات + الـ features |
| `single-tweet.test.js` | المنطق الكامل لتغريدة |
| `optimizer.test.js` | إعادات الصياغة |
| `history.test.js` | dedup + cap 20 + persistence |
| `integration.test.js` | 11 سيناريو نهاية-إلى-نهاية في الـ DOM |
| `exports.test.js` | TXT/CSV/JSON v3 + حماية CSV من حقن الصيغ |
| `arabic-data.test.js` | تطبيع القواميس، مطابقة الكلمات الحساسة بالتوكن، المحسّن العربي |
| `share-card.test.js` | بطاقة PNG: الاتجاه، القص بالقياس، حالات الفشل |
| + `dom`, `tabs`, `extractors`, `sentiment`, `storage`, `tokenize` |

---

## 🛠️ التقنيات

### Runtime (ما يصل للمتصفح)

- HTML5 semantic + ARIA
- CSS3 (Grid + Flexbox + clamp + custom properties)
- Vanilla JavaScript ES Modules (لا runtime dependencies)
- SVG + Canvas 2D

### Dev tooling (لا يُشحَن للمتصفح)

- **Vite 8** — dev server + production build
- **Vitest 4 + jsdom 29** — 162 اختبار
- **ESLint 10** + **Prettier 3**

### الحجم

```
dist/index.html                  4.24 kB │ gzip:  1.57 kB
dist/assets/index-xxx.css       17.16 kB │ gzip:  3.83 kB
dist/assets/index-xxx.js        68.02 kB │ gzip: 22.79 kB
```

**~28 KB gzipped** يصل للمتصفح. صفر runtime dependencies.

---

## 🌍 المتصفحات المدعومة

✅ Chrome / Firefox / Edge / Safari / Opera (إصدارات 2020+)
✅ جوال (iOS Safari, Chrome Android)
✅ يتطلب JavaScript مُفعَّل

---

## 🔄 سجل التحديثات

### v3.0.2 (2026-10) — الإصدار الحالي
إصلاح دقة التحليل العربي وتطبيق خطة مراجعة «مِحَك».
- 🐛 مطابقة الكلمات الحساسة بالتوكن بدل الجزء من الكلمة: «حيوانات أليفة» كانت تُصفّر درجة الخوارزمية
- 🐛 تطبيع القواميس عند التحميل: صيغ «ة/أ/ى» في قاموس المشاعر والكلمات الشائعة كانت لا تُطابَق أبداً
- 🐛 «نسبة الكلمات الطويلة» كانت تظهر `NaN%`
- 🐛 استبدالات المحسّن العربية كانت معطّلة (`\b` لا يعمل مع العربية)، واقتراح «أقصر» لم يعد يقص التغريدة
- 🎨 رقم العدادات يتبع الثيم (كان أبيض على أبيض في الثيم الفاتح)، وألوان SVG من متغيرات CSS
- ♿ ربط التبويبات بلوحاتها (`aria-controls`/`aria-labelledby`)، وإزالة `nav` المتداخل و`aria-live` على النتائج
- 🌍 شريط الطول يمتلئ من جهة بداية النص في RTL، و`ctx.direction` لبطاقة المشاركة
- 💬 رسائل فشل صادقة للتصدير والبطاقة، وتلميح للمقارنة، والحفاظ على التبويب عند تبديل اللغة
- 📱 أهداف لمس 44px على الجوال
- 🔐 حماية تصدير CSV من حقن الصيغ، وترقية Vitest (صفر ثغرات في `npm audit`)
- 🧪 فحص الأنواع `tsc` في CI، و35 اختباراً جديداً (التغطية ~90%)

### v3.0.1 (2026-07)
إصدار صيانة: إصلاحات جودة وأمان بعد مراجعة شاملة للشيفرة.
- 🔐 ترقية أدوات التطوير (Vite 8، Vitest 4، ESLint 10، jsdom 29) → **صفر ثغرات** في `npm audit`
- 🔐 إضافة `Content-Security-Policy` و`referrer` meta كتحصين دفاعي
- 🔐 تحصين قراءة السجل من `localStorage` ضد البيانات التالفة
- 🌍 إصلاح اتجاه أسهم لوحة المفاتيح في التبويبات تحت RTL
- ♿ تعريب كل `aria-label` (كانت ثابتة بالإنجليزية)
- ⚠️ إضافة تأكيد قبل مسح التغريدة أو حذف السجل
- 🧹 حذف كود v2 الميت (`stats.js`, `aggregateSentiment`)
- 📊 تصحيح نطاق تقرير التغطية ليشمل `src/**` كاملاً
- 🎨 إصلاح مكدّس الخطوط (إزالة خط غير مُحمَّل) وحشو سفلي ميت
- 🎛️ زر المقارنة يظهر معطّلاً بدل إخفائه (اكتشاف أفضل)
- 📄 إضافة ملف `LICENSE`

### v3.0.0 (2026-05)
- 🤖 إضافة كشف الذكاء الاصطناعي (9 إشارات)
- 🐦 إضافة توافقية خوارزمية xai-org (15 احتمال تفاعل)
- 🪄 إضافة مُحسِّن إعادة الصياغة
- ⚔️ إضافة مقارنة A/B
- 🗂️ إضافة سجل التحليلات
- 🖼️ إضافة بطاقة مشاركة PNG
- 🎨 إعادة تصميم كاملة (tabs, gauges, toast, theme toggle)
- 🔄 التحوّل من تحليل مجموعة تغريدات إلى تغريدة واحدة عميقة
- ✅ 128 اختبار (كان 95)

### v2.0.0 — الإصدار السابق
- إعادة هيكلة معمارية (ES Modules + Vite + Vitest)
- اختبارات وحدة (95)
- i18n (ar/en)
- SVG charts
- localStorage

### v1.0.0 (ديسمبر 2024)
- إصدار أولي
- 6 إحصاءات + تحليل مشاعر + سحابة كلمات + تصدير TXT

---

## 🌟 الميزات المستقبلية المقترحة

- [ ] PWA (تثبيت + دعم offline)
- [ ] تحليل صور التغريدات (alt-text + OCR)
- [ ] دعم منصات أخرى (LinkedIn, Bluesky)
- [ ] استيراد ملفات archives من X مباشرة
- [ ] Heatmap تلوين الكلمات داخل التغريدة بحسب تأثيرها
- [ ] اقتراح هاشتاقات ذكي من قاموس مدمج

---

## 🤝 المساهمة

نرحّب بمساهماتك! للبدء:

1. **Fork** المشروع
2. أنشئ branch جديداً (`git checkout -b feature/AmazingFeature`)
3. **Commit** التغييرات (`git commit -m 'Add AmazingFeature'`)
4. شغّل الاختبارات (`npm test`) و lint (`npm run lint`)
5. **Push** و افتح **Pull Request**

---

## 👨‍💻 المطور

**عبدالكريم العبود · ABDULKARIM ALOBUD**

- 📧 [abo.saleh.g@gmail.com](mailto:abo.saleh.g@gmail.com)
- 💻 [github.com/abosalehg-ui](https://github.com/abosalehg-ui)
- 🌐 [Live App](https://abosalehg-ui.github.io/twitter-analyzer)

---

## 📄 الترخيص

**MIT License** — حر للاستخدام والتعديل والتوزيع.

---

<a name="english"></a>

## 📋 Overview (English)

**Smart Tweet Analyzer v3.0** is a web app that diagnoses **a single tweet** across **8 analytical dimensions** without any server or external API. All processing happens locally in your browser.

### What's new in v3.0?

- 🤖 **AI detection**: 9 weighted heuristic signals to estimate the likelihood that the text was written by an LLM
- 🐦 **X algorithm fit**: a heuristic prediction engine inspired by the structure of [`xai-org/x-algorithm`](https://github.com/xai-org/x-algorithm) that estimates compatibility across 15 engagement actions
- 🪄 **Smart optimizer**: 3 rewrite variants (shorter / question / positive) with a predicted new score for each
- ⚔️ **A/B comparison** between two tweets
- 🗂️ **Analysis history** (last 20)
- 🖼️ **PNG share card** with all results

---

## ✨ Features

### 🤖 AI Detection

A 0-100 score with a confidence band (low/medium/high based on text length). Built from 9 weighted signals:

| Signal | Weight | Idea |
|---|---|---|
| Burstiness | 18% | LLMs produce uniform sentence lengths; humans vary |
| Lexical diversity (TTR) | 14% | Unusually high TTR on short text is suspicious |
| Formality | 12% | Ratio of long words (≥7 chars) |
| Punctuation polish | 12% | em-dash, smart quotes, semicolons |
| LLM cliché phrases | 15% | AR/EN dictionary (~80 phrases: "delve", "furthermore", "في الواقع", "تجدر الإشارة"...) |
| Emoji density | 8% | Zero emojis on a long tweet is suspicious |
| Slang/typo absence | 8% | "lol", "ngl", "يلا" are strong human signals |
| Hashtag pattern | 7% | Strictly clustered at the end = LLM |
| Sentence starters | 6% | Repeated "In/As/While" openings |

> ⚠️ **Disclaimer**: This is a heuristic estimate, not a definitive judgment. Even commercial tools err on short texts like tweets.

### 🐦 X Algorithm Fit

> ⚠️ **What this is and isn't**: the score is a **heuristic estimate** inspired by the weighting structure published in [`xai-org/x-algorithm`](https://github.com/xai-org/x-algorithm) — it is **not** X's actual model or its output. The real weights are not public; the weights here (`src/data/algorithm-weights.js`) and the probabilities (`predictProbabilities()`) are hand-calibrated values that only respect the documented principle: positive actions carry positive weights, negative actions larger negative ones.

The engine estimates **15 engagement-action probabilities** and combines them as:

```
Final Score = Σ (weight_i × P(action_i))
```

| Positive actions | Negative actions |
|---|---|
| like, reply, repost, share | not_interested, hide |
| click, profile_click | block_author, mute_author |
| video_view, photo_expand | report |
| dwell, follow | |

**Output**: 0-100 score + predicted reach bucket (low/medium/good/excellent) + actionable recommendations.

**What helps / hurts** (heuristic):
- ✅ Sweet-spot length (70-150 chars) → bonus
- ✅ A question triggers replies (high weight)
- ✅ Positive tone + moderate emojis
- ❌ External links → penalty
- ❌ Engagement bait ("RT to win", "like and follow") → heavy penalty
- ❌ Toxic tone (triggers block/mute/report)
- ❌ Excessive hashtags / mentions

### 🪄 Tweet Optimizer

Generates **3 rewrite variants** with predicted new scores:

1. **Shorter**: remove filler, tighten to the sweet spot
2. **Question**: append "what do you think?" to drive replies
3. **Positive**: replace negative wording + add a positive marker

### 📊 The 8 Analysis Tabs

| Tab | Content |
|---|---|
| **Overview** | 3 gauges (AI / Algo / Readability) + quick stats |
| **AI Detection** | Score + 9 signals + matched phrases |
| **X Fit** | Score + top 5 positives + worst 3 negatives + recommendations |
| **Predicted Reach** | All 15 probabilities with relative bars |
| **Optimizer** | Rewrite suggestion cards |
| **Weaknesses** | 10-item pre-publish checklist |
| **Tone** | Detected tone + best posting time + readability metrics |
| **Details** | Keywords + hashtags + mentions + emojis |

### 🎚️ Smart Composer

- **Circular counter** (green in sweet-spot, yellow at 240, red at 280+)
- **Progress bar** with highlighted 70-150 zone
- **Keyboard shortcuts**: `Cmd/Ctrl+Enter` to analyze · `Esc` to clear
- **Auto-save** draft to localStorage
- **280-char limit** with graceful warning

### ⚔️ A/B Comparison

After analyzing a tweet, click "⚔️ Compare with another tweet" → opens a second composer → displays a side-by-side table showing which is better per metric.

### 🗂️ History + 🖼️ Share Card

- **History**: last 20 analyses in localStorage with open/compare/delete actions
- **PNG card**: canvas-based 1200×630 export, ideal for social sharing

### 🌐 Bilingual + Theme

- **AR/EN** switches `dir="rtl"` ↔ `dir="ltr"` and updates all strings live
- **Dark/Light** togglable with preference persistence
- Full **ARIA** (tablist/tab/tabpanel) + `prefers-reduced-motion`

### 💾 Export

| Format | Content |
|---|---|
| **TXT 📥** | Readable text report |
| **CSV 📊** | RFC 4180 + UTF-8 BOM (Excel/Arabic) + all 15 probabilities |
| **JSON 🗂️** | Structured v3 schema for automation |
| **PNG 🖼️** | Visual share card |

---

## 🔒 Privacy & Security

- ✅ **Fully client-side**: no server, no API, no tracking, no cookies
- ✅ **localStorage stays local**: draft, history, and preferences live on your device only
- ✅ **XSS-hardened**: all user input rendered via `textContent` — no `innerHTML`
- ✅ **162 tests** including an explicit XSS guard and an Arabic-dictionary correctness guard
- ✅ **Fully open source** under MIT license

---

## 🚀 Usage

### End users
🌐 Open: **https://abosalehg-ui.github.io/twitter-analyzer**

### Developers

```bash
git clone https://github.com/abosalehg-ui/twitter-analyzer.git
cd twitter-analyzer
npm install
npm run dev           # http://localhost:5173
```

### Production

```bash
npm run build         # → dist/
npm run preview       # preview dist/
```

---

## 🧑‍💻 For Developers

See the [Arabic section](#arabic) above for the full file tree, npm scripts, deployment workflow, and test inventory — they are structurally identical regardless of locale.

### Quick reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | production build to `dist/` |
| `npm run preview` | preview `dist/` |
| `npm test` | 162 tests (vitest + jsdom) |
| `npm run test:watch` | watch mode |
| `npm run test:coverage` | coverage report |
| `npm run lint` | ESLint |
| `npm run typecheck` | JSDoc type check (`tsc`, no emit) |
| `npm run format` | Prettier |

### Bundle size

```
dist/index.html                  4.24 kB │ gzip:  1.57 kB
dist/assets/index-xxx.css       17.16 kB │ gzip:  3.83 kB
dist/assets/index-xxx.js        68.02 kB │ gzip: 22.79 kB
```

**~28 KB gzipped** reaches the browser. Zero runtime dependencies.

---

## 🛠️ Tech Stack

**Runtime** (ships to browser): HTML5 + ARIA, CSS3 (Grid/Flexbox/clamp/custom properties), vanilla ES modules, SVG + Canvas 2D.

**Dev tooling** (build-only): Vite 8, Vitest 4 + jsdom 29, ESLint 10, Prettier 3.

---

## 🌍 Browser Support

✅ Chrome / Firefox / Edge / Safari / Opera (2020+)
✅ Mobile (iOS Safari, Chrome Android)
✅ Requires JavaScript enabled

---

## 🔄 Changelog

### v3.0.2 (2026-10) — current
Arabic-analysis accuracy fixes and the «mihak» review plan.
- 🐛 Sensitive words are matched per token, not as substrings: "حيوانات أليفة" (pets) used to zero the algorithm score
- 🐛 Dictionaries are normalized at load time: entries with ة/أ/ى in the sentiment and stop-word lists never matched
- 🐛 "Long-word ratio" rendered as `NaN%`
- 🐛 Arabic optimizer replacements were dead (`\b` does not work on Arabic); the "shorter" variant no longer truncates
- 🎨 Gauge numbers follow the theme (were white-on-white in light mode); SVG colors come from CSS tokens
- ♿ Tabs linked to panels (`aria-controls`/`aria-labelledby`); removed nested `nav` and the `aria-live` on results
- 🌍 Length bar fills from the text's start edge under RTL; `ctx.direction` set on the share card
- 💬 Honest failure toasts for exports and the share card, a compare hint, active tab kept across language switch
- 📱 44px touch targets on phones
- 🔐 CSV export neutralizes spreadsheet formulas; Vitest upgraded (zero `npm audit` findings)
- 🧪 `tsc` type check in CI, 35 new tests (~90% coverage)

### v3.0.1 (2026-07)
Maintenance release: quality and security fixes following a full code review.
- 🔐 Upgraded dev tooling (Vite 8, Vitest 4, ESLint 10, jsdom 29) → **zero** `npm audit` vulnerabilities
- 🔐 Added `Content-Security-Policy` + `referrer` meta as defense in depth
- 🔐 Hardened history loading against corrupted `localStorage` data
- 🌍 Fixed tab arrow-key direction under RTL
- ♿ Localized every `aria-label` (previously hardcoded English)
- ⚠️ Added confirmation before clearing the composer or deleting history
- 🧹 Removed dead v2 code (`stats.js`, `aggregateSentiment`)
- 📊 Corrected coverage scope to report on all of `src/**`
- 🎨 Fixed the font stack (dropped an unloaded family) and dead bottom padding
- 🎛️ Compare button now renders disabled instead of hidden (discoverability)
- 📄 Added the missing `LICENSE` file

### v3.0.0 (2026-05)
- 🤖 Added AI detection (9 signals)
- 🐦 Added xai-org algorithm fit (15 actions)
- 🪄 Added rewrite optimizer
- ⚔️ Added A/B comparison
- 🗂️ Added analysis history
- 🖼️ Added PNG share card
- 🎨 Full UI redesign (tabs, gauges, toasts, theme toggle)
- 🔄 Pivoted from multi-tweet aggregation to single-tweet deep analysis
- ✅ 128 tests (up from 95)

### v2.0.0 — previous
- Architectural rewrite (ES Modules + Vite + Vitest)
- Unit tests (95)
- i18n (ar/en)
- SVG charts
- localStorage

### v1.0.0 (December 2024)
- Initial release
- 6 stats + sentiment + word cloud + TXT export

---

## 🌟 Roadmap

- [ ] PWA (installable + offline support)
- [ ] Tweet image analysis (alt-text + OCR)
- [ ] Multi-platform support (LinkedIn, Bluesky)
- [ ] Direct X archive import
- [ ] Word-level impact heatmap
- [ ] Smart hashtag suggester

---

## 🤝 Contributing

Contributions welcome! To get started:

1. **Fork** the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. Run tests (`npm test`) and lint (`npm run lint`)
5. **Push** and open a **Pull Request**

---

## 👨‍💻 Developer

**ABDULKARIM ALOBUD · عبدالكريم العبود**

- 📧 [abo.saleh.g@gmail.com](mailto:abo.saleh.g@gmail.com)
- 💻 [github.com/abosalehg-ui](https://github.com/abosalehg-ui)
- 🌐 [Live App](https://abosalehg-ui.github.io/twitter-analyzer)

---

## 📄 License

**MIT License** — free to use, modify, and distribute.

```
Copyright (c) 2024-2026 ABDULKARIM ALOBUD

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

<div align="center">

**Smart Tweet Analyzer · محلّل التغريدات الذكي** — Intelligence in every tweet

Made with ❤️ by [ABDULKARIM](https://github.com/abosalehg-ui)

⭐ Star us on GitHub if you find this useful!

</div>

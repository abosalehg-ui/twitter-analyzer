// @ts-check

export const ar = {
  // App
  'app.title': 'محلّل التغريدات الذكي',
  'app.subtitle': 'تشخيص عميق لتغريدتك: كشف AI، توافقية خوارزمية X، وتوصيات للتحسين',
  'app.dir': 'rtl',
  'app.langSwitch': 'EN',

  // Composer
  'composer.label': 'اكتب أو ألصق التغريدة:',
  'composer.placeholder': 'اكتب تغريدتك هنا… (حتى 280 حرفاً)',
  'composer.help': '💡 المنطقة المثلى للتفاعل: 70-150 حرفاً',
  'composer.charCount': 'حرف',
  'composer.charRemaining': 'متبقي',
  'composer.sweetspot': 'منطقة مثلى',
  'composer.tooLong': 'تجاوز الحد!',

  // Buttons
  'btn.analyze': '🔍 حلّل التغريدة',
  'btn.clear': '🗑️ مسح',
  'btn.compare': '⚔️ قارن مع تغريدة أخرى',
  'btn.cancelCompare': '✕ إلغاء المقارنة',
  'btn.exportTxt': '📥 TXT',
  'btn.exportCsv': '📊 CSV',
  'btn.exportJson': '🗂️ JSON',
  'btn.shareCard': '🖼️ بطاقة مشاركة',
  'btn.saveHistory': '💾 حفظ في السجل',
  'btn.copy': '📋 نسخ',
  'btn.apply': '↩️ استخدم هذا النص',
  'btn.delete': '🗑️',
  'btn.clearHistory': 'مسح السجل',
  'btn.toggleTheme': '🌓',

  // Accessibility labels (screen readers)
  'aria.themeToggle': 'تبديل المظهر بين الفاتح والداكن',
  'aria.langSwitch': 'تبديل اللغة إلى الإنجليزية',
  'aria.tabs': 'أقسام التحليل',
  'aria.deleteEntry': 'حذف هذا التحليل من السجل',

  // Confirmations (destructive actions)
  'confirm.clearInput': 'سيتم مسح نص التغريدة الحالي. هل تريد المتابعة؟',
  'confirm.clearHistory': 'سيتم حذف كل التحليلات المحفوظة في السجل نهائياً. هل تريد المتابعة؟',
  'confirm.deleteEntry': 'سيتم حذف هذا التحليل من السجل. هل تريد المتابعة؟',

  // Tabs
  'tab.overview': 'نظرة عامة',
  'tab.ai': 'كشف الذكاء الاصطناعي',
  'tab.algorithm': 'توافقية X',
  'tab.engagement': 'التفاعل المتوقع',
  'tab.optimizer': 'تحسين',
  'tab.weakness': 'نقاط الضعف',
  'tab.tone': 'النبرة',
  'tab.details': 'تفاصيل',

  // Status
  'status.empty': '⚠️ الرجاء كتابة تغريدة للتحليل',
  'status.tooLong': '⚠️ التغريدة أطول من 280 حرف',
  'status.noAnalysis': '⚠️ الرجاء إجراء التحليل أولاً',
  'status.exported': '✅ تم التصدير بنجاح',
  'status.copied': '✅ تم النسخ',
  'status.saved': '💾 حُفظ في السجل',
  'status.restored': '↩️ تم استرجاع آخر إدخال محفوظ',
  'status.cleared': '🗑️ تم المسح',
  'status.cardGenerated': '🖼️ تم توليد البطاقة',
  'status.historyCleared': '🗑️ تم مسح السجل',

  // Overview
  'overview.length': 'الطول',
  'overview.words': 'الكلمات',
  'overview.hashtags': 'هاشتاقات',
  'overview.mentions': 'إشارات',
  'overview.emojis': 'إيموجي',
  'overview.links': 'روابط',
  'overview.sentiment': 'المشاعر',
  'overview.tone': 'النبرة',
  'overview.readability': 'القراءة',
  'overview.chars': 'حرف',

  // Sentiment
  'sentiment.positive': 'إيجابي',
  'sentiment.neutral': 'محايد',
  'sentiment.negative': 'سلبي',

  // AI detection
  'ai.title': 'كشف الذكاء الاصطناعي',
  'ai.score': 'احتمالية الذكاء الاصطناعي',
  'ai.confidence': 'مستوى الثقة',
  'ai.confidence.low': 'منخفضة (النص قصير جداً)',
  'ai.confidence.medium': 'متوسطة',
  'ai.confidence.high': 'مرتفعة',
  'ai.verdict.human': 'يبدو بشرياً 👤',
  'ai.verdict.mixed': 'مختلط 🤔',
  'ai.verdict.ai': 'يبدو من الذكاء الاصطناعي 🤖',
  'ai.signals': 'الإشارات المُكتشفة',
  'ai.matchedCliches': 'عبارات شائعة في LLMs:',
  'ai.matchedHumanSignals': 'إشارات بشرية:',
  'ai.disclaimer':
    '⚠️ هذا تقدير استدلالي وليس حكماً قطعياً. حتى الأدوات التجارية تخطئ في النصوص القصيرة كالتغريدات.',
  'ai.signal.burstiness': 'تباين أطوال الجمل',
  'ai.signal.lexical_diversity': 'تنوّع المفردات',
  'ai.signal.formality': 'الرسمية',
  'ai.signal.punctuation_perfection': 'دقة الترقيم',
  'ai.signal.cliches': 'عبارات LLM شائعة',
  'ai.signal.emoji_density': 'كثافة الإيموجي',
  'ai.signal.typo_absence': 'غياب الأخطاء/الاختصارات',
  'ai.signal.hashtag_pattern': 'نمط الهاشتاقات',
  'ai.signal.sentence_starters': 'بدايات الجمل',

  // Algorithm
  'algo.title': 'توافقية خوارزمية X',
  'algo.score': 'درجة التوافقية',
  'algo.reach': 'الوصول المتوقع',
  'algo.reach.low': 'منخفض',
  'algo.reach.medium': 'متوسط',
  'algo.reach.good': 'جيد',
  'algo.reach.excellent': 'ممتاز',
  'algo.modelNote':
    'النموذج يحاكي xai-org/x-algorithm: Final Score = Σ (weight_i × P(action_i)) عبر 15 احتمال تفاعل.',
  'algo.positives': '✅ إشارات إيجابية',
  'algo.negatives': '⚠️ إشارات سلبية',
  'algo.recommendations': 'توصيات للتحسين',
  'algo.contribution': 'المساهمة',

  // Actions (15 keys)
  'action.like': 'إعجاب',
  'action.reply': 'رد',
  'action.repost': 'إعادة نشر',
  'action.share': 'مشاركة',
  'action.click': 'نقرة',
  'action.profile_click': 'فتح ملف',
  'action.video_view': 'مشاهدة فيديو',
  'action.photo_expand': 'توسيع صورة',
  'action.dwell': 'وقت التأمل',
  'action.follow': 'متابعة',
  'action.not_interested': 'غير مهتم',
  'action.block_author': 'حظر الكاتب',
  'action.mute_author': 'كتم الكاتب',
  'action.report': 'إبلاغ',
  'action.hide': 'إخفاء',

  // Algorithm recommendations
  'algo.rec.tooShort': 'التغريدة قصيرة جداً — حاول الوصول لـ 70-150 حرف.',
  'algo.rec.tooLong': 'التغريدة طويلة جداً — قد ينخفض التفاعل بعد 240 حرف.',
  'algo.rec.expandToSweetspot': 'أضف تفصيلاً أو سياقاً للوصول للمنطقة المثلى.',
  'algo.rec.externalLinks': 'الروابط الخارجية تخفض الوصول — استخدم ميديا الـ X مباشرة.',
  'algo.rec.tooManyLinks': 'روابط كثيرة — احتفظ برابط واحد كحدّ أقصى.',
  'algo.rec.tooManyHashtags': 'هاشتاقات كثيرة — اقتصر على 1-2 لتجنّب تصنيف الـ spam.',
  'algo.rec.addHashtag': 'هاشتاق واحد ذو صلة قد يوسّع الوصول.',
  'algo.rec.tooManyMentions': 'إشارات كثيرة — اقتصر على 2-3 إشارات مرتبطة فعلاً.',
  'algo.rec.addQuestion': 'أضف سؤالاً لتحفيز الردود (وزن الرد عالٍ في الخوارزمية).',
  'algo.rec.removeBait': 'احذف عبارات صيد التفاعل (مثل "ريتويت إذا…") — تُعاقَب بشدّة.',
  'algo.rec.removeToxicity': 'النبرة الهجومية تثير حظراً وكتماً — لطّف الصياغة.',
  'algo.rec.removeSpam': 'كلمات تسويقية تخفض الثقة — استخدم لغة أكثر طبيعية.',
  'algo.rec.addEmoji': 'إيموجي واحد مناسب يرفع جاذبية النص.',
  'algo.rec.tooManyEmojis': 'إيموجي كثير — التركيز يضعف بعد 6 إيموجي.',
  'algo.rec.lessCaps': 'الحروف الكبيرة الكثيرة تبدو كصراخ — قلّلها.',
  'algo.rec.improveSentiment': 'نبرة سلبية — صياغة أكثر بنّاءة قد تزيد التفاعل.',
  'algo.rec.allGood': '✨ التغريدة متوافقة جيداً مع الخوارزمية!',

  // Engagement
  'engagement.title': 'التفاعل المتوقع',
  'engagement.positiveActions': 'الإجراءات الإيجابية',
  'engagement.negativeActions': 'الإجراءات السلبية',
  'engagement.probability': 'الاحتمال',
  'engagement.subtitle': 'تقدير نسبي لاحتمال كل إجراء بناءً على خصائص النص. ليست أرقاماً مطلقة.',

  // Optimizer
  'optimizer.title': 'مُحسِّن التغريدة',
  'optimizer.subtitle': 'اقتراحات بإعادة الصياغة مع درجة الخوارزمية الجديدة المتوقعة.',
  'optimizer.shorter': 'نسخة أقصر وأكثر تركيزاً',
  'optimizer.question': 'نسخة بصيغة سؤال لتحفيز الردود',
  'optimizer.positive': 'نسخة بنبرة أكثر إيجابية',
  'optimizer.predictedScore': 'الدرجة المتوقعة',
  'optimizer.delta': 'التغير',
  'optimizer.empty': 'لا توجد اقتراحات تحسين — التغريدة في حالة ممتازة!',

  // Weakness checker
  'weakness.title': 'فحص نقاط الضعف',
  'weakness.subtitle': 'قائمة تحقّق سريعة قبل النشر',
  'weakness.hasQuestion': 'يحتوي سؤالاً يحفّز الردود',
  'weakness.noExternalLinks': 'بدون روابط خارجية',
  'weakness.goodLength': 'الطول في المنطقة المثلى (70-150)',
  'weakness.fewHashtags': 'هاشتاقات معتدلة (≤2)',
  'weakness.noBait': 'بدون صيد تفاعل',
  'weakness.noToxicity': 'بدون نبرة سامة',
  'weakness.noSpam': 'بدون كلمات تسويقية مفرطة',
  'weakness.hasEmoji': 'يحتوي إيموجي معبراً',
  'weakness.notAllCaps': 'لا يحتوي حروفاً كبيرة مفرطة',
  'weakness.positiveSentiment': 'نبرة عامة إيجابية أو محايدة',

  // Tone
  'tone.title': 'النبرة المُكتشفة',
  'tone.formal': 'رسمي',
  'tone.friendly': 'ودود',
  'tone.educational': 'تعليمي',
  'tone.promotional': 'ترويجي',
  'tone.inspirational': 'تحفيزي',
  'tone.inquisitive': 'تساؤلي',
  'tone.neutral': 'محايد',
  'tone.bestTime.formal': '🕒 أفضل وقت: 09:00 - 11:00 (أيام العمل)',
  'tone.bestTime.friendly': '🕒 أفضل وقت: 19:00 - 22:00',
  'tone.bestTime.educational': '🕒 أفضل وقت: 12:00 - 14:00',
  'tone.bestTime.promotional': '🕒 أفضل وقت: 10:00 - 12:00، 18:00 - 20:00',
  'tone.bestTime.inspirational': '🕒 أفضل وقت: 06:00 - 09:00',
  'tone.bestTime.inquisitive': '🕒 أفضل وقت: 20:00 - 23:00',
  'tone.bestTime.neutral': '🕒 أفضل وقت: 12:00 - 15:00',

  // Readability
  'read.title': 'مؤشّر القراءة',
  'read.level.easy': 'سهلة',
  'read.level.medium': 'متوسطة',
  'read.level.hard': 'صعبة',
  'read.avgWord': 'متوسط طول الكلمة',
  'read.avgSentence': 'متوسط طول الجملة',
  'read.longRatio': 'نسبة الكلمات الطويلة',

  // Details
  'details.title': 'تفاصيل النص',
  'details.keywords': 'الكلمات المفتاحية',
  'details.hashtags': 'الهاشتاقات',
  'details.mentions': 'الإشارات',
  'details.emojis': 'الإيموجي',
  'details.none': 'لا يوجد',

  // History
  'history.title': '🗂️ السجل (آخر 20)',
  'history.empty': 'لا يوجد سجل بعد — التحاليل ستظهر هنا.',
  'history.compareWithCurrent': '⚔️ قارن مع الحالية',
  'history.load': '📥 افتح',

  // Comparison
  'compare.title': '⚔️ مقارنة A/B',
  'compare.tweetA': 'التغريدة A',
  'compare.tweetB': 'التغريدة B',
  'compare.winner': '🏆 الأفضل توافقاً',
  'compare.tie': '🤝 متعادلتان',
  'compare.diff': 'الفرق',

  // Share card
  'card.title': 'محلّل التغريدات الذكي',
  'card.aiScore': 'الذكاء الاصطناعي',
  'card.algoScore': 'توافقية X',
  'card.reach': 'الوصول المتوقع',
  'card.brand': 'twitter-analyzer',

  // Export filename
  'report.filename': 'تحليل_التغريدة',
};

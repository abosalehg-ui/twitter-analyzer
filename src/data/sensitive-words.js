// @ts-check

// Categories of content that the X algorithm tends to down-rank or restrict
// (per public docs: blocks, mutes, reports drive negative weights).
// Curated to be mild — focused on tone/toxicity, NOT explicit content.

export const SENSITIVE_PATTERNS = {
  toxicity: {
    ar: [
      'غبي',
      'احمق',
      'أحمق',
      'تافه',
      'حقير',
      'وقح',
      'كذاب',
      'كذابه',
      'كذابة',
      'منافق',
      'خائن',
      'قذر',
      'حيوان',
      'كلب',
    ],
    en: [
      'idiot',
      'stupid',
      'dumb',
      'moron',
      'trash',
      'garbage',
      'liar',
      'loser',
      'pathetic',
      'disgusting',
      'shut up',
      'shutup',
    ],
  },
  political: {
    ar: ['حرب', 'انتخابات', 'تظاهر', 'احتجاج', 'حكومه', 'حكومة', 'رئيس', 'حزب'],
    en: ['election', 'protest', 'government', 'president', 'war', 'partisan', 'regime'],
  },
  // Spam-flavored words that algorithms penalize hard
  spammy: {
    ar: ['اربح المال', 'ربح سريع', 'دخل سريع', 'اشترك الان', 'اشترك الآن', 'فرصه ذهبيه', 'فرصة ذهبية'],
    en: [
      'click here',
      'buy now',
      'limited offer',
      'limited time',
      'act now',
      'free money',
      'make money fast',
      'get rich',
      'work from home',
      'guaranteed income',
      '100% free',
    ],
  },
};

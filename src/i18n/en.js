// @ts-check

export const en = {
  // App
  'app.title': 'Smart Tweet Analyzer',
  'app.subtitle':
    'Deep diagnostics for your tweet: AI detection, X-algorithm fit, and improvement suggestions',
  'app.dir': 'ltr',
  'app.langSwitch': 'AR',

  // Composer
  'composer.label': 'Type or paste your tweet:',
  'composer.placeholder': 'Write your tweet here… (up to 280 chars)',
  'composer.help': '💡 Engagement sweet spot: 70-150 chars',
  'composer.charCount': 'chars',
  'composer.charRemaining': 'left',
  'composer.sweetspot': 'sweet spot',
  'composer.tooLong': 'Over the limit!',

  // Buttons
  'btn.analyze': '🔍 Analyze Tweet',
  'btn.clear': '🗑️ Clear',
  'btn.compare': '⚔️ Compare with another tweet',
  'btn.cancelCompare': '✕ Cancel comparison',
  'btn.exportTxt': '📥 TXT',
  'btn.exportCsv': '📊 CSV',
  'btn.exportJson': '🗂️ JSON',
  'btn.shareCard': '🖼️ Share Card',
  'btn.saveHistory': '💾 Save to History',
  'btn.copy': '📋 Copy',
  'btn.apply': '↩️ Use this text',
  'btn.delete': '🗑️',
  'btn.clearHistory': 'Clear history',
  'btn.toggleTheme': '🌓',

  // Accessibility labels (screen readers)
  'aria.themeToggle': 'Toggle between light and dark theme',
  'aria.langSwitch': 'Switch language to Arabic',
  'aria.tabs': 'Analysis sections',
  'aria.deleteEntry': 'Delete this analysis from history',

  // Confirmations (destructive actions)
  'confirm.clearInput': 'This will clear the current tweet text. Continue?',
  'confirm.clearHistory':
    'This will permanently delete every saved analysis in your history. Continue?',
  'confirm.deleteEntry': 'This will delete this analysis from your history. Continue?',

  // Tabs
  'tab.overview': 'Overview',
  'tab.ai': 'AI Detection',
  'tab.algorithm': 'X Fit',
  'tab.engagement': 'Predicted Reach',
  'tab.optimizer': 'Optimizer',
  'tab.weakness': 'Weaknesses',
  'tab.tone': 'Tone',
  'tab.details': 'Details',

  // Status
  'status.empty': '⚠️ Please enter a tweet to analyze',
  'status.tooLong': '⚠️ Tweet exceeds 280 characters',
  'status.noAnalysis': '⚠️ Please run analysis first',
  'status.exported': '✅ Exported successfully',
  'status.copied': '✅ Copied',
  'status.saved': '💾 Saved to history',
  'status.restored': '↩️ Restored last input',
  'status.cleared': '🗑️ Cleared',
  'status.cardGenerated': '🖼️ Card generated',
  'status.historyCleared': '🗑️ History cleared',

  // Overview
  'overview.length': 'Length',
  'overview.words': 'Words',
  'overview.hashtags': 'Hashtags',
  'overview.mentions': 'Mentions',
  'overview.emojis': 'Emojis',
  'overview.links': 'Links',
  'overview.sentiment': 'Sentiment',
  'overview.tone': 'Tone',
  'overview.readability': 'Readability',
  'overview.chars': 'chars',

  // Sentiment
  'sentiment.positive': 'Positive',
  'sentiment.neutral': 'Neutral',
  'sentiment.negative': 'Negative',

  // AI detection
  'ai.title': 'AI Detection',
  'ai.score': 'AI likelihood',
  'ai.confidence': 'Confidence',
  'ai.confidence.low': 'Low (text too short)',
  'ai.confidence.medium': 'Medium',
  'ai.confidence.high': 'High',
  'ai.verdict.human': 'Looks human 👤',
  'ai.verdict.mixed': 'Mixed 🤔',
  'ai.verdict.ai': 'Looks AI-generated 🤖',
  'ai.signals': 'Detected signals',
  'ai.matchedCliches': 'Common LLM phrases:',
  'ai.matchedHumanSignals': 'Human signals:',
  'ai.disclaimer':
    '⚠️ This is a heuristic estimate, not a definitive judgment. Even commercial tools err on short texts like tweets.',
  'ai.signal.burstiness': 'Sentence length variance',
  'ai.signal.lexical_diversity': 'Vocabulary diversity',
  'ai.signal.formality': 'Formality',
  'ai.signal.punctuation_perfection': 'Punctuation polish',
  'ai.signal.cliches': 'Common LLM phrases',
  'ai.signal.emoji_density': 'Emoji density',
  'ai.signal.typo_absence': 'Lack of typos/slang',
  'ai.signal.hashtag_pattern': 'Hashtag pattern',
  'ai.signal.sentence_starters': 'Sentence starters',

  // Algorithm
  'algo.title': 'X Algorithm Fit',
  'algo.score': 'Compatibility score',
  'algo.reach': 'Predicted reach',
  'algo.reach.low': 'Low',
  'algo.reach.medium': 'Medium',
  'algo.reach.good': 'Good',
  'algo.reach.excellent': 'Excellent',
  'algo.modelNote':
    'Modeled after xai-org/x-algorithm: Final Score = Σ (weight_i × P(action_i)) over 15 engagement actions.',
  'algo.positives': '✅ Positive signals',
  'algo.negatives': '⚠️ Negative signals',
  'algo.recommendations': 'Recommendations',
  'algo.contribution': 'Contribution',

  // Actions
  'action.like': 'Like',
  'action.reply': 'Reply',
  'action.repost': 'Repost',
  'action.share': 'Share',
  'action.click': 'Click',
  'action.profile_click': 'Profile click',
  'action.video_view': 'Video view',
  'action.photo_expand': 'Photo expand',
  'action.dwell': 'Dwell',
  'action.follow': 'Follow',
  'action.not_interested': 'Not interested',
  'action.block_author': 'Block author',
  'action.mute_author': 'Mute author',
  'action.report': 'Report',
  'action.hide': 'Hide',

  // Algorithm recommendations
  'algo.rec.tooShort': 'Tweet is too short — aim for 70-150 chars.',
  'algo.rec.tooLong': 'Tweet is too long — engagement drops after 240 chars.',
  'algo.rec.expandToSweetspot': 'Add detail or context to reach the sweet spot.',
  'algo.rec.externalLinks': 'External links hurt reach — prefer native X media.',
  'algo.rec.tooManyLinks': 'Too many links — keep at most one.',
  'algo.rec.tooManyHashtags': 'Too many hashtags — limit to 1-2 to avoid spam flagging.',
  'algo.rec.addHashtag': 'One relevant hashtag may widen reach.',
  'algo.rec.tooManyMentions': 'Too many mentions — keep to 2-3 truly relevant ones.',
  'algo.rec.addQuestion': 'Add a question to trigger replies (reply weight is high in the algo).',
  'algo.rec.removeBait': 'Remove engagement-bait phrases ("RT if…") — heavily penalized.',
  'algo.rec.removeToxicity': 'Hostile tone triggers blocks/mutes — soften the wording.',
  'algo.rec.removeSpam': 'Marketing language lowers trust — use natural phrasing.',
  'algo.rec.addEmoji': 'A well-placed emoji boosts visual appeal.',
  'algo.rec.tooManyEmojis': 'Too many emojis — focus drops after 6.',
  'algo.rec.lessCaps': 'Excessive caps reads as shouting — tone it down.',
  'algo.rec.improveSentiment': 'Negative tone — a more constructive framing may boost engagement.',
  'algo.rec.allGood': '✨ Tweet is well-aligned with the algorithm!',

  // Engagement
  'engagement.title': 'Predicted Engagement',
  'engagement.positiveActions': 'Positive actions',
  'engagement.negativeActions': 'Negative actions',
  'engagement.probability': 'Probability',
  'engagement.subtitle':
    'Relative likelihood per action, derived from text features. Not absolute numbers.',

  // Optimizer
  'optimizer.title': 'Tweet Optimizer',
  'optimizer.subtitle': 'Rewrite suggestions with their predicted new algorithm score.',
  'optimizer.shorter': 'Shorter, tighter version',
  'optimizer.question': 'Question form to drive replies',
  'optimizer.positive': 'More positive framing',
  'optimizer.predictedScore': 'Predicted score',
  'optimizer.delta': 'Change',
  'optimizer.empty': 'No improvements needed — tweet is in great shape!',

  // Weakness checker
  'weakness.title': 'Weakness Check',
  'weakness.subtitle': 'Quick pre-publish checklist',
  'weakness.hasQuestion': 'Contains a question that invites replies',
  'weakness.noExternalLinks': 'No external links',
  'weakness.goodLength': 'Length is in the sweet spot (70-150)',
  'weakness.fewHashtags': 'Moderate hashtags (≤2)',
  'weakness.noBait': 'No engagement bait',
  'weakness.noToxicity': 'No toxic tone',
  'weakness.noSpam': 'No spammy marketing words',
  'weakness.hasEmoji': 'Has at least one expressive emoji',
  'weakness.notAllCaps': 'No excessive ALL-CAPS',
  'weakness.positiveSentiment': 'Overall tone is positive or neutral',

  // Tone
  'tone.title': 'Detected tone',
  'tone.formal': 'Formal',
  'tone.friendly': 'Friendly',
  'tone.educational': 'Educational',
  'tone.promotional': 'Promotional',
  'tone.inspirational': 'Inspirational',
  'tone.inquisitive': 'Inquisitive',
  'tone.neutral': 'Neutral',
  'tone.bestTime.formal': '🕒 Best time: 09:00 - 11:00 (weekdays)',
  'tone.bestTime.friendly': '🕒 Best time: 19:00 - 22:00',
  'tone.bestTime.educational': '🕒 Best time: 12:00 - 14:00',
  'tone.bestTime.promotional': '🕒 Best time: 10:00 - 12:00, 18:00 - 20:00',
  'tone.bestTime.inspirational': '🕒 Best time: 06:00 - 09:00',
  'tone.bestTime.inquisitive': '🕒 Best time: 20:00 - 23:00',
  'tone.bestTime.neutral': '🕒 Best time: 12:00 - 15:00',

  // Readability
  'read.title': 'Readability',
  'read.level.easy': 'Easy',
  'read.level.medium': 'Medium',
  'read.level.hard': 'Hard',
  'read.avgWord': 'Avg word length',
  'read.avgSentence': 'Avg sentence length',
  'read.longRatio': 'Long-word ratio',

  // Details
  'details.title': 'Text details',
  'details.keywords': 'Keywords',
  'details.hashtags': 'Hashtags',
  'details.mentions': 'Mentions',
  'details.emojis': 'Emojis',
  'details.none': 'None',

  // History
  'history.title': '🗂️ History (last 20)',
  'history.empty': 'No history yet — analyses will appear here.',
  'history.compareWithCurrent': '⚔️ Compare with current',
  'history.load': '📥 Open',

  // Comparison
  'compare.title': '⚔️ A/B Comparison',
  'compare.tweetA': 'Tweet A',
  'compare.tweetB': 'Tweet B',
  'compare.winner': '🏆 Best fit',
  'compare.tie': '🤝 Tied',
  'compare.diff': 'Difference',

  // Share card
  'card.title': 'Smart Tweet Analyzer',
  'card.aiScore': 'AI score',
  'card.algoScore': 'X fit',
  'card.reach': 'Predicted reach',
  'card.brand': 'twitter-analyzer',

  // Export filename
  'report.filename': 'tweet_analysis',
};

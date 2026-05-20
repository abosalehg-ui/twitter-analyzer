// @ts-check

// Weights for the 15 actions tracked by the xai-org/x-algorithm transformer
// (Final Score = Σ weight_i × P(action_i)).
// Exact weights are not publicly disclosed; these are calibrated heuristics
// that respect the documented principle: positive actions → positive weights,
// negative actions → negative weights (typically larger in magnitude).

export const ACTION_WEIGHTS = {
  // Positive actions
  like: 1,
  reply: 27,
  repost: 20,
  share: 15,
  click: 11,
  profile_click: 12,
  video_view: 10,
  photo_expand: 8,
  dwell: 0.5,
  follow: 24,
  // Negative actions (larger magnitude — algorithm suppresses harder than it rewards)
  not_interested: -50,
  block_author: -74,
  mute_author: -50,
  report: -369,
  hide: -10,
};

export const ACTION_KEYS = /** @type {Array<keyof typeof ACTION_WEIGHTS>} */ (
  Object.keys(ACTION_WEIGHTS)
);

export const POSITIVE_ACTIONS = ACTION_KEYS.filter((k) => ACTION_WEIGHTS[k] > 0);
export const NEGATIVE_ACTIONS = ACTION_KEYS.filter((k) => ACTION_WEIGHTS[k] < 0);

// Theoretical max raw score (all positive actions at P=1, all negatives at P=0)
// Used for normalizing to 0..100.
export const MAX_RAW_SCORE = POSITIVE_ACTIONS.reduce((sum, k) => sum + ACTION_WEIGHTS[k], 0);

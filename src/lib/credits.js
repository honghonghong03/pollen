export const TARGETING_MULTIPLIERS = {
  open: 1,
  basic: 1.5,
  targeted: 2.5,
};

export const BASE_COST_PER_RESPONSE = 1;
export const STARTER_CREDITS = 15;
export const FREE_FIRST_SURVEY_LIMIT = 25; // first survey free up to 25 responses

export function calculateCost(responsesNeeded, targetingLevel = 'open', isFirstSurvey = false) {
  if (isFirstSurvey) return 0;
  const multiplier = TARGETING_MULTIPLIERS[targetingLevel] || 1;
  return responsesNeeded * BASE_COST_PER_RESPONSE * multiplier;
}

export function calculateEarnings(estimatedMinutes, qualityMultiplier = 1.0) {
  return estimatedMinutes * qualityMultiplier;
}

export function getTargetingLevel(survey) {
  if (!survey.targeting_enabled) return 'open';
  if (survey.target_age_range || survey.target_country || survey.target_language) {
    if (survey.target_education || survey.target_custom) return 'targeted';
    return 'basic';
  }
  return 'open';
}

export function formatCredits(amount) {
  return amount % 1 === 0 ? amount.toString() : amount.toFixed(1);
}

export function creditRewardTier(credits) {
  if (credits >= 8) return 'high';
  if (credits >= 4) return 'mid';
  return 'low';
}

// === LEVELS ===
export const LEVELS = [
  { name: 'Seedling', min: 0, max: 24, color: 'text-gray-400', bg: 'bg-gray-100', border: 'border-gray-200', emoji: '\ud83c\udf31' },
  { name: 'Sprout', min: 25, max: 99, color: 'text-stem', bg: 'bg-stem/10', border: 'border-stem/20', emoji: '\ud83c\udf3f' },
  { name: 'Bloom', min: 100, max: 299, color: 'text-honey', bg: 'bg-honey/10', border: 'border-honey/20', emoji: '\ud83c\udf3b' },
  { name: 'Pollinator', min: 300, max: 699, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', emoji: '\ud83d\udc1d' },
  { name: 'Honeycomb', min: 700, max: Infinity, color: 'text-honey', bg: 'bg-honey/15', border: 'border-honey/30', emoji: '\ud83c\udf6f' },
];

export function getLevel(totalEarned) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalEarned >= LEVELS[i].min) return { ...LEVELS[i], index: i };
  }
  return { ...LEVELS[0], index: 0 };
}

export function getLevelProgress(totalEarned) {
  const level = getLevel(totalEarned);
  if (level.max === Infinity) return 100;
  const range = level.max - level.min + 1;
  const progress = totalEarned - level.min;
  return Math.min(Math.round((progress / range) * 100), 100);
}

export function getNextLevel(totalEarned) {
  const current = getLevel(totalEarned);
  if (current.index >= LEVELS.length - 1) return null;
  return LEVELS[current.index + 1];
}

// === BADGES ===
export const BADGES = [
  { id: 'first_steps', name: 'First Steps', description: 'Complete your first survey', emoji: '\ud83d\udc63', check: (stats) => stats.surveysTaken >= 1 },
  { id: 'handful', name: 'Handful', description: 'Complete 5 surveys', emoji: '\u270b', check: (stats) => stats.surveysTaken >= 5 },
  { id: 'double_digits', name: 'Double Digits', description: 'Complete 10 surveys', emoji: '\ud83c\udfaf', check: (stats) => stats.surveysTaken >= 10 },
  { id: 'half_century', name: 'Half Century', description: 'Complete 50 surveys', emoji: '\ud83c\udfc6', check: (stats) => stats.surveysTaken >= 50 },
  { id: 'creator', name: 'Creator', description: 'Publish your first survey', emoji: '\ud83d\udcdd', check: (stats) => stats.surveysCreated >= 1 },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Reach a 5.0 trust score', emoji: '\u2b50', check: (stats) => stats.trustScore >= 5.0 },
  { id: 'streak_week', name: 'Streak Week', description: 'Answer 5+ surveys in a week', emoji: '\ud83d\udd25', check: (stats) => stats.surveysTaken >= 5 },
  { id: 'full_profile', name: 'Full Profile', description: 'Complete all profile fields', emoji: '\ud83d\udcce', check: (stats) => stats.profileComplete },
  { id: 'generous', name: 'Generous', description: 'Earn 100+ credits total', emoji: '\ud83d\udcb0', check: (stats) => stats.totalEarned >= 100 },
  { id: 'veteran', name: 'Veteran', description: 'Earn 500+ credits total', emoji: '\ud83d\udc8e', check: (stats) => stats.totalEarned >= 500 },
];

export function getUnlockedBadges(stats) {
  return BADGES.filter((b) => b.check(stats));
}

export function getBadgeStatus(stats) {
  return BADGES.map((b) => ({ ...b, unlocked: b.check(stats) }));
}

// === LEADERBOARD (mock data) ===
const MOCK_LEADERBOARD_USERS = [
  { id: 'lb1', name: 'Sarah Chen', totalEarned: 847, weekEarned: 62, surveysTaken: 94 },
  { id: 'lb2', name: 'Marcus Johnson', totalEarned: 623, weekEarned: 45, surveysTaken: 71 },
  { id: 'lb3', name: 'Aisha Patel', totalEarned: 581, weekEarned: 78, surveysTaken: 63 },
  { id: 'lb4', name: 'David Kim', totalEarned: 445, weekEarned: 31, surveysTaken: 52 },
  { id: 'lb5', name: 'Elena Rodriguez', totalEarned: 412, weekEarned: 55, surveysTaken: 48 },
  { id: 'lb6', name: 'James Wright', totalEarned: 389, weekEarned: 22, surveysTaken: 41 },
  { id: 'lb7', name: 'Mei Lin', totalEarned: 334, weekEarned: 40, surveysTaken: 38 },
  { id: 'lb8', name: 'Omar Hassan', totalEarned: 298, weekEarned: 18, surveysTaken: 35 },
  { id: 'lb9', name: 'Sofia Andersson', totalEarned: 256, weekEarned: 29, surveysTaken: 30 },
  { id: 'lb10', name: 'Lucas Nguyen', totalEarned: 201, weekEarned: 15, surveysTaken: 24 },
];

export function getLeaderboard(tab, currentUser, totalEarned, surveysTaken) {
  const userEntry = currentUser ? {
    id: currentUser.id,
    name: currentUser.display_name,
    totalEarned,
    weekEarned: Math.round(totalEarned * 0.15),
    surveysTaken,
    isCurrentUser: true,
  } : null;

  let list = [...MOCK_LEADERBOARD_USERS.map((u) => ({ ...u, isCurrentUser: false }))];
  if (userEntry) list.push(userEntry);

  switch (tab) {
    case 'top_earners':
      list.sort((a, b) => b.totalEarned - a.totalEarned);
      return list.map((u, i) => ({ ...u, rank: i + 1, stat: u.totalEarned, statLabel: 'credits earned' }));
    case 'this_week':
      list.sort((a, b) => b.weekEarned - a.weekEarned);
      return list.map((u, i) => ({ ...u, rank: i + 1, stat: u.weekEarned, statLabel: 'this week' }));
    case 'most_helpful':
      list.sort((a, b) => b.surveysTaken - a.surveysTaken);
      return list.map((u, i) => ({ ...u, rank: i + 1, stat: u.surveysTaken, statLabel: 'surveys' }));
    default:
      return list;
  }
}

// === REWARDS ===
export const REWARDS = [
  { id: 'r1', name: '$5 Amazon Gift Card', cost: 500, emoji: '\ud83d\udce6', category: 'Gift Cards' },
  { id: 'r2', name: '$10 Amazon Gift Card', cost: 1000, emoji: '\ud83d\udce6', category: 'Gift Cards' },
  { id: 'r3', name: '$5 Starbucks Card', cost: 500, emoji: '\u2615', category: 'Gift Cards' },
  { id: 'r4', name: 'Custom Sticker Pack', cost: 200, emoji: '\ud83c\udfa8', category: 'Merch' },
  { id: 'r5', name: 'Donate to Student Research', cost: 100, emoji: '\ud83c\udf93', category: 'Give Back' },
  { id: 'r6', name: 'Premium Profile Badge', cost: 150, emoji: '\u2728', category: 'Digital' },
];

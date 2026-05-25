const INTERVALS = [
  5 * 60 * 1000,       // 5 分钟
  30 * 60 * 1000,      // 30 分钟
  12 * 60 * 60 * 1000, // 12 小时
  24 * 60 * 60 * 1000, // 1 天
  2 * 24 * 60 * 60 * 1000,  // 2 天
  4 * 24 * 60 * 60 * 1000,  // 4 天
  7 * 24 * 60 * 60 * 1000,  // 7 天
  15 * 24 * 60 * 60 * 1000, // 15 天
  30 * 24 * 60 * 60 * 1000, // 30 天
];

function calculateNextReview(stage, remembered) {
  const now = Date.now();
  if (remembered) {
    const nextStage = Math.min(stage + 1, INTERVALS.length - 1);
    return { stage: nextStage, nextReviewAt: now + INTERVALS[nextStage] };
  } else {
    return { stage: 0, nextReviewAt: now + INTERVALS[0] };
  }
}

module.exports = { calculateNextReview, INTERVALS };

/**
 * 格式化概率为百分比字符串
 */
export const formatProbability = (probability: number): string => {
  return `${(probability * 100).toFixed(1)}%`;
};

/**
 * 根据概率获取颜色
 */
export const getProbabilityColor = (probability: number): string => {
  if (probability > 0.7) return '#4caf50'; // 高 - 绿色
  if (probability > 0.55) return '#8bc34a'; // 中高 - 浅绿
  if (probability > 0.45) return '#ff9800'; // 接近 - 橙色
  if (probability > 0.3) return '#ff5722'; // 中低 - 深橙
  return '#f44336'; // 低 - 红色
};

/**
 * 格式化日期
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * 获取投注建议的描述
 */
export const getBettingRecommendationText = (recommendation: string): string => {
  const texts: Record<string, string> = {
    'STRONG_WIN': 'Strongly Recommend Betting on Player 1',
    'WIN': 'Recommend Betting on Player 1',
    'AVOID': 'Avoid Betting - Too Close to Call',
    'LOSE': 'Recommend Betting on Player 2',
    'STRONG_LOSE': 'Strongly Recommend Betting on Player 2'
  };
  return texts[recommendation] || recommendation;
};
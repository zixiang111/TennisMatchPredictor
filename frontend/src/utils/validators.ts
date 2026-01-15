import type { PredictionRequest } from '@/types/prediction';

/**
 * 验证预测请求数据
 */
export const validatePredictionRequest = (request: PredictionRequest): string[] => {
  const errors: string[] = [];
  
  if (!request.player1Name?.trim()) {
    errors.push('Player 1 name is required');
  }
  
  if (!request.player2Name?.trim()) {
    errors.push('Player 2 name is required');
  }
  
  if (request.player1Name?.trim() === request.player2Name?.trim()) {
    errors.push('Players cannot be the same');
  }
  
  return errors;
};

/**
 * 验证球员名称格式
 */
export const isValidPlayerName = (name: string): boolean => {
  const nameRegex = /^[A-Za-z\s.'-]{2,50}$/;
  return nameRegex.test(name.trim());
};
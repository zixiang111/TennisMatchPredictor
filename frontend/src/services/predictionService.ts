import { api } from './api';
import type { PredictionRequest, PredictionResponse } from '@/types/prediction';

class PredictionService {
  // 提交预测请求
  async predictMatch(request: PredictionRequest): Promise<PredictionResponse> {
    return await api.getPrediction(request);
  }

  // 模拟预测（当后端API不可用时使用）
  simulatePrediction(request: PredictionRequest): PredictionResponse {
    const player1WinProbability = 0.5 + (Math.random() - 0.5) * 0.3; // 0.35 - 0.65
    const confidenceLevel = this.calculateConfidenceLevel(player1WinProbability);
    
    return {
      predictionId: `sim_${Date.now()}`,
      player1Name: request.player1Name,
      player2Name: request.player2Name,
      player1WinProbability,
      player2WinProbability: 1 - player1WinProbability,
      confidenceLevel,
      recommendedBet: this.getRecommendation(player1WinProbability),
      keyFactors: [
        { factor: 'Recent Form', impact: 'POSITIVE', description: 'Player 1 has won 4 of last 5 matches' },
        { factor: 'Surface Experience', impact: 'NEUTRAL', description: 'Both players have similar experience on this surface' },
        { factor: 'Head-to-Head', impact: 'NEGATIVE', description: 'Player 2 leads 3-1 in previous meetings' }
      ],
      matchDetails: {
        surface: request.surface || 'HARD',
        tournament: request.tournament || 'Australian Open',
        predictedWinner: player1WinProbability > 0.5 ? request.player1Name : request.player2Name
      },
      timestamp: new Date().toISOString()
    };
  }

  private calculateConfidenceLevel(probability: number): 'HIGH' | 'MEDIUM' | 'LOW' {
    const distanceFrom50 = Math.abs(probability - 0.5);
    if (distanceFrom50 > 0.3) return 'HIGH';
    if (distanceFrom50 > 0.15) return 'MEDIUM';
    return 'LOW';
  }

  private getRecommendation(probability: number): PredictionResponse['recommendedBet'] {
    if (probability > 0.7) return 'STRONG_WIN';
    if (probability > 0.55) return 'WIN';
    if (probability < 0.3) return 'STRONG_LOSE';
    if (probability < 0.45) return 'LOSE';
    return 'AVOID';
  }
}

export const predictionService = new PredictionService();

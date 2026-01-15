export interface Player {
  id: string;
  name: string;
  rank?: number;
  country?: string;
  winRate?: number;
}

export interface Tournament {
  id: string;
  name: string;
  surface: CourtSurface;
  level: 'GRAND_SLAM' | 'MASTERS' | '500' | '250'| '1000';
}

export type CourtSurface = 'HARD' | 'CLAY' | 'GRASS' | 'CARPET';

export interface PredictionRequest {
  player1Name: string;
  player2Name: string;
  tournament?: string;
  surface?: CourtSurface;
  date?: string;
}

export interface PredictionResponse {
  predictionId: string;
  player1Name: string;
  player2Name: string;
  player1WinProbability: number;
  player2WinProbability: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedBet: 'STRONG_WIN' | 'WIN' | 'AVOID' | 'LOSE' | 'STRONG_LOSE';
  keyFactors: Array<{
    factor: string;
    impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    description: string;
  }>;
  matchDetails?: {
    surface: CourtSurface;
    tournament: string;
    predictedWinner: string;
    predictedScore?: string;
  };
  timestamp: string;
}

export interface HistoricalMatch {
  id: string;
  player1: string;
  player2: string;
  winner: string;
  date: string;
  tournament: string;
  surface: CourtSurface;
  player1WinProbability?: number;
  actualCorrect: boolean;
}

export interface PlayerStats {
  playerId: string;
  name: string;
  overallWinRate: number;
  surfaceStats: Record<CourtSurface, {
    matches: number;
    wins: number;
    winRate: number;
  }>;
  recentForm: Array<{
    result: 'WIN' | 'LOSS';
    opponent: string;
    date: string;
  }>;
}
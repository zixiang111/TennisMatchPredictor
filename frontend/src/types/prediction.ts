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
  player1_name: string;
  player2_name: string;
  player1_rank: number;
  player2_rank: number;
  player1_points: number;
  player2_points: number;
  player1_aces: number;
  player2_aces: number;
  player1_breaks: number;
  player2_breaks: number;
  player1_first_serve_pct: number;
  player2_first_serve_pct: number;
  player1_win_pct_career: number;
  player2_win_pct_career: number;
  tournament_name: string;
  surface: string;
  round?: string;
  match_duration_minutes?: number;
}

export interface EnsemblePrediction {
  player1_win_prob: number;
  player2_win_prob: number;
  favorite: string;
  confidence: number;
}

export interface PredictionResponse {
  player1_name: string;
  player2_name: string;
  predictions: Record<string, {
    player1_win_prob: number;
    player2_win_prob: number;
  }>;
  ensemble_prediction: EnsemblePrediction;
}

export interface HistoricalMatch {
  id: number;
  player1_name: string;
  player2_name: string;
  player1_win_prob: number;
  player2_win_prob: number;
  predicted_winner: string;
  confidence: number;
  tournament: string;
  surface: string;
  actual_winner?: string;
  created_at: string;
}

export interface PlayerStats {
  id: number;
  name: string;
  rank: number;
  points: number;
  career_titles: number;
  career_matches: number;
  career_wins: number;
  avg_aces_per_match: number;
  avg_first_serve_pct: number;
  surface_preferences: string;
  country: string;
}
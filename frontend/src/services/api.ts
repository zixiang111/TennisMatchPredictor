import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type {
  PredictionRequest,
  PredictionResponse,
  HistoricalMatch,
  PlayerStats,
  Tournament
} from '@/types/prediction';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class TennisPredictorApi {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // 获取比赛预测
  async getPrediction(request: PredictionRequest): Promise<PredictionResponse> {
    try {
      const response: AxiosResponse<PredictionResponse> = await this.client.post(
        '/predict',
        request
      );
      return response.data;
    } catch (error) {
      console.error('Prediction API error:', error);
      throw this.handleError(error);
    }
  }

  // 获取历史预测记录
  async getHistoricalPredictions(limit: number = 10): Promise<HistoricalMatch[]> {
    try {
      const response: AxiosResponse<HistoricalMatch[]> = await this.client.get(
        `/predictions/history?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error('Historical predictions error:', error);
      throw this.handleError(error);
    }
  }

  // 获取球员数据
  async searchPlayers(query: string): Promise<any[]> {
    try {
      const response: AxiosResponse<any[]> = await this.client.get(
        `/players/search?query=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      console.error('Player search error:', error);
      throw this.handleError(error);
    }
  }

  // 获取球员统计数据
  async getPlayerStats(playerName: string): Promise<PlayerStats> {
    try {
      const response: AxiosResponse<PlayerStats> = await this.client.get(
        `/players/${encodeURIComponent(playerName)}/stats`
      );
      return response.data;
    } catch (error) {
      console.error('Player stats error:', error);
      throw this.handleError(error);
    }
  }

  // 获取赛事列表
  async getTournaments(): Promise<Tournament[]> {
    try {
      const response: AxiosResponse<Tournament[]> = await this.client.get('/tournaments');
      return response.data;
    } catch (error) {
      console.error('Tournaments error:', error);
      throw this.handleError(error);
    }
  }

  // 获取系统健康状态
  async getHealth(): Promise<{ status: string; services: any }> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        return new Error('Network error - Please check your connection');
      }
    }
    return new Error('An unexpected error occurred');
  }
}

export const api = new TennisPredictorApi();
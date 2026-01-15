import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
  import CancelIcon from '@mui/icons-material/Cancel';
import { api } from '@/services/api';
import type { HistoricalMatch } from '@/types/prediction';
import { formatDate, formatProbability } from '@/utils/formatters';

const HistoricalPredictions: React.FC = () => {
  const [predictions, setPredictions] = useState<HistoricalMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistoricalPredictions();
  }, []);

  const fetchHistoricalPredictions = async () => {
    try {
      setLoading(true);
      const data = await api.getHistoricalPredictions(10);
      setPredictions(data);
    } catch (err) {
      setError('Failed to load historical predictions');
      // 使用模拟数据
      setPredictions(generateMockPredictions());
    } finally {
      setLoading(false);
    }
  };

  const generateMockPredictions = (): HistoricalMatch[] => {
    const players = [
      'Novak Djokovic', 'Carlos Alcaraz', 'Rafael Nadal', 'Daniil Medvedev',
      'Jannik Sinner', 'Alexander Zverev', 'Stefanos Tsitsipas'
    ];
    const tournaments = ['Australian Open', 'Wimbledon', 'US Open', 'French Open'];
    const surfaces = ['HARD', 'CLAY', 'GRASS'] as const;

    return Array.from({ length: 8 }, (_, i) => {
      const player1 = players[Math.floor(Math.random() * players.length)];
      const player2 = players.filter(p => p !== player1)[Math.floor(Math.random() * (players.length - 1))];
      const predictedWinner = Math.random() > 0
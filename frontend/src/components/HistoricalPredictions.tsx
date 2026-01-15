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
import RefreshIcon from '@mui/icons-material/Refresh';
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
      setError(null);
      const data = await api.getHistoricalPredictions(10);
      setPredictions(data);
    } catch (err) {
      console.error('Failed to load historical predictions:', err);
      setError('Failed to load historical predictions. Using sample data instead.');
      // 使用模拟数据作为后备
      setPredictions(generateMockPredictions());
    } finally {
      setLoading(false);
    }
  };

  const generateMockPredictions = (): HistoricalMatch[] => {
    const players = [
      'Novak Djokovic', 'Carlos Alcaraz', 'Rafael Nadal', 'Daniil Medvedev',
      'Jannik Sinner', 'Alexander Zverev', 'Stefanos Tsitsipas', 'Taylor Fritz'
    ];
    const tournaments = [
      { name: 'Australian Open', location: 'Melbourne, Australia' },
      { name: 'Wimbledon', location: 'London, UK' },
      { name: 'US Open', location: 'New York, USA' },
      { name: 'French Open', location: 'Paris, France' },
      { name: 'ATP Finals', location: 'Turin, Italy' },
      { name: 'Indian Wells Masters', location: 'California, USA' }
    ];
    const surfaces = ['HARD', 'CLAY', 'GRASS'] as const;

    return Array.from({ length: 10 }, (_, i) => {
      // 随机选择不重复的两名选手
      const playerIndex1 = Math.floor(Math.random() * players.length);
      let playerIndex2;
      do {
        playerIndex2 = Math.floor(Math.random() * players.length);
      } while (playerIndex2 === playerIndex1);
      
      const player1 = players[playerIndex1];
      const player2 = players[playerIndex2];
      const tournament = tournaments[Math.floor(Math.random() * tournaments.length)];
      const surface = surfaces[Math.floor(Math.random() * surfaces.length)];
      
      // 生成随机概率（55-95%之间，更真实）
      const predictedProbability = Math.random() * 0.4 + 0.55; // 0.55 - 0.95
      
      // 随机决定预测的获胜者（1或2）
      const predictedWinner = Math.random() > 0.5 ? 1 : 2;
      
      // 随机决定实际获胜者（可能和预测一致或不一致）
      const actualWinner = Math.random() > 0.3 ? predictedWinner : (predictedWinner === 1 ? 2 : 1);
      
      // 生成一个过去7-365天的随机日期
      const matchDate = new Date();
      matchDate.setDate(matchDate.getDate() - Math.floor(Math.random() * 358) - 7);
      
      return {
        id: `match-${i + 1}`,
        matchDate: matchDate.toISOString(),
        tournament: tournament.name,
        tournamentLocation: tournament.location,
        player1,
        player2,
        surface,
        predictedWinner,
        predictedProbability,
        actualWinner,
        correct: predictedWinner === actualWinner
      };
    }).sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()); // 按日期倒序
  };

  const getSurfaceColor = (surface: string) => {
    switch (surface) {
      case 'HARD': return 'primary';
      case 'CLAY': return 'error';
      case 'GRASS': return 'success';
      default: return 'default';
    }
  };

  const getPlayerName = (playerNumber: number, match: HistoricalMatch) => {
    return playerNumber === 1 ? match.player1 : match.player2;
  };

  const handleRefresh = () => {
    fetchHistoricalPredictions();
  };

  if (loading && predictions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <HistoryIcon color="primary" />
            <Typography variant="h5" component="h2">
              Historical Predictions
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Refresh predictions">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Tournament</TableCell>
                <TableCell>Match</TableCell>
                <TableCell>Surface</TableCell>
                <TableCell align="center">Predicted Winner</TableCell>
                <TableCell align="center">Prediction Confidence</TableCell>
                <TableCell align="center">Actual Winner</TableCell>
                <TableCell align="center">Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {predictions.map((match) => (
                <TableRow key={match.id} hover>
                  <TableCell>{formatDate(match.matchDate)}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {match.tournament}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {match.tournamentLocation}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {match.player1} vs {match.player2}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={match.surface} 
                      size="small" 
                      color={getSurfaceColor(match.surface)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      color="primary"
                    >
                      {getPlayerName(match.predictedWinner, match)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <Typography 
                        variant="body2"
                        sx={{
                          fontWeight: 'medium',
                          color: match.predictedProbability > 0.7 ? 'success.main' : 
                                 match.predictedProbability > 0.6 ? 'warning.main' : 'error.main'
                        }}
                      >
                        {formatProbability(match.predictedProbability)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                    >
                      {getPlayerName(match.actualWinner, match)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {match.correct ? (
                      <Tooltip title="Prediction was correct">
                        <CheckCircleIcon color="success" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Prediction was incorrect">
                        <CancelIcon color="error" />
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {predictions.length === 0 && !loading && (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">
              No historical predictions found.
            </Typography>
          </Box>
        )}
      </Paper>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {predictions.length} predictions
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip 
            icon={<CheckCircleIcon />} 
            label={`${predictions.filter(m => m.correct).length} correct`}
            size="small"
            color="success"
            variant="outlined"
          />
          <Chip 
            icon={<CancelIcon />} 
            label={`${predictions.filter(m => !m.correct).length} incorrect`}
            size="small"
            color="error"
            variant="outlined"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HistoricalPredictions;
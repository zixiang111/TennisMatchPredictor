import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import HistoricalPredictions from '@/components/HistoricalPredictions';
import { api } from '@/services/api';
import type { HistoricalMatch } from '@/types/prediction';

const HistoryPage: React.FC = () => {
  const [predictions, setPredictions] = useState<HistoricalMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getHistoricalPredictions(50);
      setPredictions(data);
    } catch (err) {
      console.error('Failed to load predictions:', err);
      setError('Failed to load prediction history');
    } finally {
      setLoading(false);
    }
  };

  const correctCount = predictions.filter(m => m.correct).length;
  const totalCount = predictions.length;
  const accuracy = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(1) : 0;

  const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color?: string }> = ({
    icon,
    label,
    value,
    color = 'primary'
  }) => (
    <Card elevation={2}>
      <CardContent>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {label}
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ opacity: 0.7 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ mb: 4, p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          📊 Prediction History & Analytics
        </Typography>
        <Typography variant="body1">
          Review historical match predictions and track prediction accuracy over time
        </Typography>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<EqualizerIcon sx={{ fontSize: 32 }} color="primary" />}
                label="Total Predictions"
                value={totalCount}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<CheckCircleIcon sx={{ fontSize: 32 }} color="success" />}
                label="Correct Predictions"
                value={correctCount}
                color="success.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<CancelIcon sx={{ fontSize: 32 }} color="error" />}
                label="Incorrect Predictions"
                value={totalCount - correctCount}
                color="error.main"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={<TrendingUpIcon sx={{ fontSize: 32 }} color="warning" />}
                label="Accuracy Rate"
                value={`${accuracy}%`}
                color="warning.main"
              />
            </Grid>
          </Grid>

          {error && (
            <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
              <Typography color="error">{error}</Typography>
            </Paper>
          )}

          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={<CheckCircleIcon />}
              label={`${correctCount} Correct`}
              color="success"
              variant="outlined"
              size="medium"
            />
            <Chip
              icon={<CancelIcon />}
              label={`${totalCount - correctCount} Incorrect`}
              color="error"
              variant="outlined"
              size="medium"
            />
            <Chip
              label={`${totalCount} Total Predictions`}
              variant="outlined"
              size="medium"
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          <HistoricalPredictions />
        </>
      )}
    </Container>
  );
};

export default HistoryPage;

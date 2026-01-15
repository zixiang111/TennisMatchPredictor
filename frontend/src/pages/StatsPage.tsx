import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { api } from '@/services/api';
import type { HistoricalMatch } from '@/types/prediction';

const StatsPage: React.FC = () => {
  const [predictions, setPredictions] = useState<HistoricalMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getHistoricalPredictions(100);
        setPredictions(data);
      } catch (err) {
        console.error('Failed to load statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalPredictions = predictions.length;
  const correctPredictions = predictions.filter(m => m.correct).length;
  const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions * 100).toFixed(2) : 0;

  const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string }> = ({ title, value, subtitle }) => (
    <Card>
      <CardContent>
        <Typography color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Prediction Statistics
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Predictions" value={totalPredictions} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Correct Predictions" value={correctPredictions} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Accuracy" value={`${accuracy}%`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Incorrect Predictions" 
            value={totalPredictions - correctPredictions} 
          />
        </Grid>
      </Grid>

      {loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography>Loading statistics...</Typography>
        </Box>
      )}
    </Container>
  );
};

export default StatsPage;

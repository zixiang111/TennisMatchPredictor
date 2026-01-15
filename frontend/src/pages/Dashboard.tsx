import React, { useState } from 'react';
import { Container, Box, Grid, Paper, Typography } from '@mui/material';
import PredictionForm from '@/components/PredictionForm';
import PredictionResult from '@/components/PredictionResult';
import HistoricalPredictions from '@/components/HistoricalPredictions';
import type { PredictionResponse } from '@/types/prediction';

const Dashboard: React.FC = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePredictionComplete = (result: PredictionResponse) => {
    setPredictionResult(result);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ mb: 4, p: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🎾 Tennis Match Predictor
        </Typography>
        <Typography variant="body1">
          AI-powered predictions based on historical performance, surface statistics, and recent form
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <PredictionForm onPredictionComplete={handlePredictionComplete} />
          {predictionResult && <PredictionResult result={predictionResult} />}
        </Grid>

        <Grid item xs={12} lg={6}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <HistoricalPredictions key={refreshKey} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

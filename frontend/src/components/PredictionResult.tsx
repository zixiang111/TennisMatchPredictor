import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import type { PredictionResponse } from '@/types/prediction';
import {
  formatProbability,
  getProbabilityColor,
  getBettingRecommendationText
} from '@/utils/formatters';

interface PredictionResultProps {
  result: PredictionResponse;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  const theme = useTheme();
  
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'success';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'error';
      default: return 'default';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes('STRONG_WIN')) return 'success';
    if (recommendation.includes('WIN')) return 'success';
    if (recommendation.includes('LOSE')) return 'error';
    if (recommendation.includes('STRONG_LOSE')) return 'error';
    return 'warning';
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <EmojiEventsIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h5" component="h2">
          Prediction Results
        </Typography>
      </Box>

      {/* Winner Prediction */}
      <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🏆 Predicted Winner
          </Typography>
          <Typography variant="h4">
            {result.player1WinProbability > 0.5 ? result.player1Name : result.player2Name}
          </Typography>
          <Typography variant="body2">
            {result.matchDetails?.tournament} • {result.matchDetails?.surface} Court
          </Typography>
        </CardContent>
      </Card>

      {/* Probability Bars */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {result.player1Name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ color: getProbabilityColor(result.player1WinProbability), mr: 2 }}>
                {formatProbability(result.player1WinProbability)}
              </Typography>
              {result.player1WinProbability > 0.5 ? (
                <TrendingUpIcon color="success" />
              ) : (
                <TrendingDownIcon color="error" />
              )}
            </Box>
            <LinearProgress
              variant="determinate"
              value={result.player1WinProbability * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: theme.palette.grey[300],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getProbabilityColor(result.player1WinProbability),
                  borderRadius: 5
                }
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {result.player2Name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ color: getProbabilityColor(result.player2WinProbability), mr: 2 }}>
                {formatProbability(result.player2WinProbability)}
              </Typography>
              {result.player2WinProbability > 0.5 ? (
                <TrendingUpIcon color="success" />
              ) : (
                <TrendingDownIcon color="error" />
              )}
            </Box>
            <LinearProgress
              variant="determinate"
              value={result.player2WinProbability * 100}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: theme.palette.grey[300],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getProbabilityColor(result.player2WinProbability),
                  borderRadius: 5
                }
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Confidence and Recommendation */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EqualizerIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Confidence Level</Typography>
              </Box>
              <Chip
                label={result.confidenceLevel}
                color={getConfidenceColor(result.confidenceLevel)}
                size="medium"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Based on data quality and statistical significance
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Betting Recommendation
              </Typography>
              <Chip
                label={getBettingRecommendationText(result.recommendedBet)}
                color={getRecommendationColor(result.recommendedBet) as any}
                size="medium"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                {result.recommendedBet === 'AVOID' 
                  ? 'Match is too close to call - consider avoiding bets'
                  : `Probability strongly favors ${result.player1WinProbability > 0.5 ? result.player1Name : result.player2Name}`
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Key Factors */}
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        Key Factors Influencing Prediction
      </Typography>
      <Grid container spacing={2}>
        {result.keyFactors?.map((factor, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {factor.impact === 'POSITIVE' && <TrendingUpIcon color="success" sx={{ mr: 1 }} />}
                  {factor.impact === 'NEGATIVE' && <TrendingDownIcon color="error" sx={{ mr: 1 }} />}
                  {factor.impact === 'NEUTRAL' && <EqualizerIcon color="action" sx={{ mr: 1 }} />}
                  <Typography variant="subtitle2">
                    {factor.factor}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {factor.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Match Details */}
      {result.matchDetails && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" color="text.secondary">
            Prediction ID: {result.predictionId} • Generated: {new Date(result.timestamp).toLocaleString()}
          </Typography>
        </>
      )}
    </Paper>
  );
};

export default PredictionResult;
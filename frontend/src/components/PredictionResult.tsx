import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import type { PredictionResponse } from '@/types/prediction';

interface PredictionResultProps {
  result: PredictionResponse;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  const { ensemble_prediction: ensemble, player1_name, player2_name, predictions } = result;

  const player1Prob = Math.round(ensemble.player1_win_prob * 100);
  const player2Prob = Math.round(ensemble.player2_win_prob * 100);
  const isPlayer1Favorite = ensemble.favorite === 'player1';

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3, background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <EmojiEventsIcon sx={{ color: '#667eea', fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Prediction Result
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ textAlign: 'center', border: isPlayer1Favorite ? '2px solid #667eea' : 'none' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {player1_name}
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="h3" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                  {player1Prob}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={player1Prob}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                }}
              />
              {isPlayer1Favorite && (
                <Chip
                  icon={<TrendingUpIcon />}
                  label="Favorite"
                  color="primary"
                  size="small"
                  sx={{ mt: 2 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ textAlign: 'center', border: !isPlayer1Favorite ? '2px solid #764ba2' : 'none' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {player2_name}
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="h3" sx={{ color: '#764ba2', fontWeight: 'bold' }}>
                  {player2Prob}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={player2Prob}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                }}
              />
              {!isPlayer1Favorite && (
                <Chip
                  icon={<TrendingUpIcon />}
                  label="Favorite"
                  color="secondary"
                  size="small"
                  sx={{ mt: 2 }}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          📊 Confidence Level
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {ensemble.confidence > 0.8
            ? 'Very High Confidence'
            : ensemble.confidence > 0.7
            ? 'High Confidence'
            : ensemble.confidence > 0.6
            ? 'Moderate Confidence'
            : 'Low Confidence'}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={ensemble.confidence * 100}
          sx={{
            mt: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              background: ensemble.confidence > 0.7
                ? 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)'
                : 'linear-gradient(90deg, #ed8936 0%, #dd6b20 100%)',
            },
          }}
        />
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          Confidence: {(ensemble.confidence * 100).toFixed(1)}%
        </Typography>
      </Box>

      {predictions && Object.keys(predictions).length > 0 && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
            🤖 Model Details
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(predictions).map(([modelName, modelPred]) => (
              <Grid item xs={12} sm={6} key={modelName}>
                <Card variant="outlined">
                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                      {modelName.replace(/_/g, ' ')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                      <Box>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {player1_name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#667eea' }}>
                          {(modelPred.player1_win_prob * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {player2_name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#764ba2' }}>
                          {(modelPred.player2_win_prob * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default PredictionResult;
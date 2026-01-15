import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Typography,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '@/services/api';
import type { PredictionRequest, PredictionResponse } from '@/types/prediction';

interface PredictionFormProps {
  onPredictionComplete?: (result: PredictionResponse) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredictionComplete }) => {
  const [formData, setFormData] = useState<Partial<PredictionRequest>>({
    player1_name: '',
    player2_name: '',
    player1_rank: 1,
    player2_rank: 2,
    player1_points: 8000,
    player2_points: 7000,
    player1_aces: 10,
    player2_aces: 8,
    player1_breaks: 5,
    player2_breaks: 3,
    player1_first_serve_pct: 0.64,
    player2_first_serve_pct: 0.61,
    player1_win_pct_career: 0.82,
    player2_win_pct_career: 0.80,
    tournament_name: 'Test Tournament',
    surface: 'Hard',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.player1_name || !formData.player2_name) {
      setError('Please enter both player names');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await api.getPrediction(formData as PredictionRequest);
      setSuccess(true);
      onPredictionComplete?.(result);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SearchIcon /> Match Prediction
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">Prediction successful!</Alert>}

          <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'bold' }}>
            Player Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Player 1 Name"
                name="player1_name"
                value={formData.player1_name || ''}
                onChange={handleInputChange}
                placeholder="e.g., Novak Djokovic"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Player 2 Name"
                name="player2_name"
                value={formData.player2_name || ''}
                onChange={handleInputChange}
                placeholder="e.g., Rafael Nadal"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 1 Rank"
                name="player1_rank"
                value={formData.player1_rank || ''}
                onChange={handleInputChange}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 2 Rank"
                name="player2_rank"
                value={formData.player2_rank || ''}
                onChange={handleInputChange}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 1 Points"
                name="player1_points"
                value={formData.player1_points || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 2 Points"
                name="player2_points"
                value={formData.player2_points || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 1 Career Win %"
                name="player1_win_pct_career"
                value={formData.player1_win_pct_career || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 2 Career Win %"
                name="player2_win_pct_career"
                value={formData.player2_win_pct_career || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 'bold' }}>
            Match Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tournament"
                name="tournament_name"
                value={formData.tournament_name || ''}
                onChange={handleInputChange}
                placeholder="e.g., Wimbledon"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Surface"
                name="surface"
                value={formData.surface || ''}
                onChange={handleInputChange}
                placeholder="e.g., Hard, Clay, Grass"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 1 Aces"
                name="player1_aces"
                value={formData.player1_aces || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 2 Aces"
                name="player2_aces"
                value={formData.player2_aces || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 1 First Serve %"
                name="player1_first_serve_pct"
                value={formData.player1_first_serve_pct || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 2 First Serve %"
                name="player2_first_serve_pct"
                value={formData.player2_first_serve_pct || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0, max: 1, step: 0.01 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 1 Breaks"
                name="player1_breaks"
                value={formData.player1_breaks || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Player 2 Breaks"
                name="player2_breaks"
                value={formData.player2_breaks || ''}
                onChange={handleInputChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              }
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Predicting...
              </>
            ) : (
              'Get Prediction'
            )}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default PredictionForm;
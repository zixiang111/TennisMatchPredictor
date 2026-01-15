import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
  Grid,
  Autocomplete,
  Chip
} from '@mui/material';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SearchIcon from '@mui/icons-material/Search';
import { predictionService } from '@/services/predictionService';
import type { PredictionRequest, PredictionResponse, CourtSurface } from '@/types/prediction';
import { validatePredictionRequest } from '@/utils/validators';

interface PredictionFormProps {
  onPredictionComplete?: (result: PredictionResponse) => void;
  initialValues?: Partial<PredictionRequest>;
}

const surfaces: CourtSurface[] = ['HARD', 'CLAY', 'GRASS', 'CARPET'];
const tournaments = [
  'Australian Open',
  'French Open',
  'Wimbledon',
  'US Open',
  'ATP Finals',
  'Indian Wells Masters',
  'Miami Open',
  'Monte-Carlo Masters',
  'Madrid Open',
  'Italian Open',
  'Canadian Open',
  'Cincinnati Masters',
  'Shanghai Masters',
  'Paris Masters'
];

const PredictionForm: React.FC<PredictionFormProps> = ({
  onPredictionComplete,
  initialValues
}) => {
  const [formData, setFormData] = useState<PredictionRequest>({
    player1Name: initialValues?.player1Name || '',
    player2Name: initialValues?.player2Name || '',
    tournament: initialValues?.tournament || 'Australian Open',
    surface: initialValues?.surface || 'HARD',
    date: initialValues?.date || new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [playerSuggestions, setPlayerSuggestions] = useState<{ player1: string[], player2: string[] }>({
    player1: [],
    player2: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validatePredictionRequest(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setErrors([]);
    setLoading(true);
    
    try {
      const result = await predictionService.predictMatch(formData);
      onPredictionComplete?.(result);
    } catch (error) {
      console.error('Prediction failed:', error);
      setErrors(['Prediction service is temporarily unavailable. Please try again later.']);
      // 使用模拟数据作为后备方案
      const simulatedResult = predictionService.simulatePrediction(formData);
      onPredictionComplete?.(simulatedResult);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PredictionRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      surface: e.target.value as CourtSurface
    }));
  };

  const searchPlayers = async (query: string, field: 'player1' | 'player2') => {
    if (query.length < 2) return;
    
    try {
      // 这里可以调用实际的球员搜索API
      const mockSuggestions = [
        'Novak Djokovic',
        'Carlos Alcaraz',
        'Rafael Nadal',
        'Daniil Medvedev',
        'Jannik Sinner',
        'Alexander Zverev',
        'Stefanos Tsitsipas',
        'Andrey Rublev',
        'Taylor Fritz',
        'Holger Rune'
      ].filter(name => name.toLowerCase().includes(query.toLowerCase()));
      
      setPlayerSuggestions(prev => ({
        ...prev,
        [field]: mockSuggestions
      }));
    } catch (error) {
      console.error('Player search error:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SportsTennisIcon color="primary" sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h5" component="h1">
          Tennis Match Predictor
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Enter player names and match details to get AI-powered predictions based on historical performance,
        surface statistics, and recent form.
      </Typography>

      {errors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Player 1 Input */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Player 1"
              variant="outlined"
              value={formData.player1Name}
              onChange={handleInputChange('player1Name')}
              onFocus={() => searchPlayers(formData.player1Name, 'player1')}
              required
              placeholder="e.g., Novak Djokovic"
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                ),
              }}
            />
            {playerSuggestions.player1.length > 0 && (
              <Paper sx={{ mt: 1, maxHeight: 200, overflow: 'auto' }}>
                {playerSuggestions.player1.map((name, index) => (
                  <Chip
                    key={index}
                    label={name}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, player1Name: name }));
                      setPlayerSuggestions(prev => ({ ...prev, player1: [] }));
                    }}
                    sx={{ m: 0.5 }}
                    size="small"
                  />
                ))}
              </Paper>
            )}
          </Grid>

          {/* Player 2 Input */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Player 2"
              variant="outlined"
              value={formData.player2Name}
              onChange={handleInputChange('player2Name')}
              onFocus={() => searchPlayers(formData.player2Name, 'player2')}
              required
              placeholder="e.g., Carlos Alcaraz"
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                ),
              }}
            />
          </Grid>

          {/* Tournament Selection */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Tournament"
              value={formData.tournament}
              onChange={handleInputChange('tournament')}
            >
              {tournaments.map((tournament) => (
                <MenuItem key={tournament} value={tournament}>
                  {tournament}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Surface Selection */}
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Court Surface"
              value={formData.surface}
              onChange={handleSurfaceChange}
            >
              {surfaces.map((surface) => (
                <MenuItem key={surface} value={surface}>
                  {surface.charAt(0) + surface.slice(1).toLowerCase()}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Match Date */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="Match Date"
              value={formData.date}
              onChange={handleInputChange('date')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 2 }} />
                  Predicting...
                </>
              ) : (
                'Predict Match Outcome'
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PredictionForm;
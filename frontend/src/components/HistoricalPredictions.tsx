import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import { api } from '@/services/api';
import type { HistoricalMatch } from '@/types/prediction';

const HistoricalPredictions: React.FC = () => {
  const [predictions, setPredictions] = useState<HistoricalMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getHistoricalPredictions(10);
      setPredictions(data);
    } catch (err) {
      console.error('Failed to fetch predictions:', err);
      setError('Failed to load historical predictions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (predictions.length === 0) {
    return <Alert severity="info">No predictions available yet</Alert>;
  }

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        📈 Latest Predictions
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List sx={{ maxHeight: 500, overflow: 'auto' }}>
        {predictions.map((pred, index) => (
          <React.Fragment key={pred.id}>
            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {pred.player1_name} vs {pred.player2_name}
                    </Typography>
                    <Chip
                      label={`${(pred.confidence * 100).toFixed(0)}%`}
                      size="small"
                      color={pred.confidence > 0.7 ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Predicted: <strong>{pred.predicted_winner}</strong>
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {pred.tournament} • {pred.surface}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {new Date(pred.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < predictions.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default HistoricalPredictions;
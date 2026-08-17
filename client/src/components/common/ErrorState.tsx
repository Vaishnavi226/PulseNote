import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "We couldn't load this content",
  message = 'Check your connection and try again.',
  onRetry,
}) => {
  return (
    <Box
      sx={{
        py: 8,
        px: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 4,
        border: '1px border',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        my: 4,
      }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: '50%',
          backgroundColor: 'error.main',
          color: '#FFFFFF',
          mb: 2,
          opacity: 0.9,
        }}
      >
        <AlertCircle size={28} />
      </Box>

      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mb: 3 }}>
        {message}
      </Typography>

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outlined"
          color="primary"
          startIcon={<RefreshCw size={16} />}
        >
          Retry
        </Button>
      )}
    </Box>
  );
};

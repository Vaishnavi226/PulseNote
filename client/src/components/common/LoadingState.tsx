import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  height?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading content...',
  height = 240,
}) => {
  return (
    <Box
      sx={{
        py: 6,
        px: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100%',
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height={height}
        sx={{ borderRadius: 3, opacity: 0.6 }}
      />
      <Typography variant="caption" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

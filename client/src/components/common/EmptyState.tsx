import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Inbox } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  actionPath?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Nothing here yet',
  message = 'Explore articles and ideas to join the discussion.',
  actionLabel,
  actionPath,
  onAction,
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
        border: '1px dashed',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        my: 4,
      }}
    >
      <Box sx={{ p: 2, borderRadius: '50%', backgroundColor: 'action.hover', mb: 2 }}>
        <Inbox size={32} color="#8A9096" />
      </Box>

      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mb: 3 }}>
        {message}
      </Typography>

      {actionLabel && actionPath && (
        <Button component={RouterLink} to={actionPath} variant="contained" color="primary">
          {actionLabel}
        </Button>
      )}

      {actionLabel && !actionPath && onAction && (
        <Button onClick={onAction} variant="contained" color="primary">
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

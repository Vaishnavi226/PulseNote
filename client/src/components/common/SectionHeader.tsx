import React from 'react';
import { Box, Typography, SxProps, Theme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Kicker } from './Kicker';

interface SectionHeaderProps {
  kicker?: string;
  title: string;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
  headingVariant?: 'h2' | 'h3';
  showRule?: boolean;
  sx?: SxProps<Theme>;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  kicker,
  title,
  actionLabel,
  actionTo,
  onAction,
  headingVariant = 'h2',
  showRule = true,
  sx,
}) => {
  const hasAction = Boolean(actionLabel && (actionTo || onAction));

  return (
    <Box
      sx={[
        {
          borderTop: showRule ? '1px solid' : 'none',
          borderColor: 'divider',
          pt: showRule ? { xs: 2.5, md: 3 } : 0,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          {kicker && (
            <Kicker color="accent" sx={{ mb: 0.5 }}>
              {kicker}
            </Kicker>
          )}
          <Typography variant={headingVariant} component={headingVariant}>
            {title}
          </Typography>
        </Box>

        {hasAction && actionTo && (
          <Typography
            component={RouterLink}
            to={actionTo}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.primary',
              textDecoration: 'none',
              pb: 0.5,
              transition: 'color 160ms ease',
              '&:hover': {
                color: 'secondary.dark',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              },
            }}
          >
            {actionLabel}
            <ArrowRight size={16} />
          </Typography>
        )}

        {hasAction && !actionTo && onAction && (
          <Typography
            component="button"
            onClick={onAction}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
              border: 'none',
              background: 'none',
              padding: 0,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              fontFamily: 'inherit',
              color: 'text.primary',
              pb: 0.5,
              transition: 'color 160ms ease',
              '&:hover': {
                color: 'secondary.dark',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              },
            }}
          >
            {actionLabel}
            <ArrowRight size={16} />
          </Typography>
        )}
      </Box>
    </Box>
  );
};

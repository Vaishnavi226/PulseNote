import React from 'react';
import { Typography, SxProps, Theme } from '@mui/material';

interface KickerProps {
  children: React.ReactNode;
  color?: 'default' | 'accent';
  component?: React.ElementType;
  sx?: SxProps<Theme>;
}

export const Kicker: React.FC<KickerProps> = ({
  children,
  color = 'default',
  component = 'span',
  sx,
}) => {
  return (
    <Typography
      variant="overline"
      component={component}
      sx={[
        {
          display: 'block',
          color: color === 'accent' ? 'secondary.dark' : 'text.muted',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {children}
    </Typography>
  );
};

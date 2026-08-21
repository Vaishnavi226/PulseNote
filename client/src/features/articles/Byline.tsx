import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { AuthorSummary } from './types';

interface BylineProps {
  author: AuthorSummary;
  publishedAt?: string | null;
  readingTimeMin?: number;
  size?: 'sm' | 'md';
  bio?: string | null;
  authorTitle?: string | null;
}

const formatDate = (value: string, long: boolean) =>
  new Date(value).toLocaleDateString('en-US', long
    ? { month: 'long', day: 'numeric', year: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' });

export const Byline: React.FC<BylineProps> = ({
  author,
  publishedAt,
  readingTimeMin,
  size = 'sm',
  bio,
  authorTitle,
}) => {
  const isMd = size === 'md';
  const avatarSize = isMd ? 40 : 22;
  const date = publishedAt ? formatDate(publishedAt, isMd) : null;

  const metaParts = [
    date,
    readingTimeMin != null ? `${readingTimeMin} min read` : null,
  ].filter(Boolean) as string[];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: isMd ? 2 : 1.25, minWidth: 0 }}>
      <Avatar
        src={author.avatarUrl || undefined}
        alt={author.name}
        sx={{
          width: avatarSize,
          height: avatarSize,
          bgcolor: 'text.primary',
          color: 'background.default',
          fontSize: isMd ? '0.9375rem' : '0.6875rem',
          fontWeight: 700,
        }}
      >
        {author.name.charAt(0).toUpperCase()}
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant={isMd ? 'body2' : 'caption'}
          sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}
        >
          {author.name}
        </Typography>
        {isMd && (bio || authorTitle) && (
          <Typography variant="caption" sx={{ display: 'block', mt: 0.25 }}>
            {authorTitle || bio}
          </Typography>
        )}
        {metaParts.length > 0 && (
          <Typography variant="caption" sx={{ display: 'block', mt: 0.25 }}>
            {metaParts.join(' · ')}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

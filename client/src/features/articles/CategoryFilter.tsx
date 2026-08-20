import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { Category } from './types';

interface CategoryFilterProps {
  categories: Category[] | undefined;
  isLoading: boolean;
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  isLoading,
  selectedSlug,
  onSelect,
}) => {
  if (isLoading || !categories) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block', fontWeight: 600, letterSpacing: '0.05em' }}>
        FILTER BY TOPIC
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label="All"
          onClick={() => onSelect(null)}
          variant={selectedSlug === null ? 'filled' : 'outlined'}
          color={selectedSlug === null ? 'primary' : 'default'}
          sx={{
            fontWeight: 600,
            borderRadius: '10px',
            '&:hover': { boxShadow: '0 2px 8px rgba(92, 120, 184, 0.15)' },
          }}
        />
        {categories.map((category) => (
          <Chip
            key={category.slug}
            label={category.name}
            onClick={() => onSelect(category.slug)}
            variant={selectedSlug === category.slug ? 'filled' : 'outlined'}
            color={selectedSlug === category.slug ? 'primary' : 'default'}
            sx={{
              fontWeight: 600,
              borderRadius: '10px',
              '&:hover': { boxShadow: '0 2px 8px rgba(92, 120, 184, 0.15)' },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

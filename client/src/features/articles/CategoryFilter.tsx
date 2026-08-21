import React from 'react';
import { Box, Chip } from '@mui/material';
import { Category } from './types';
import { Kicker } from '../../components/common/Kicker';

interface CategoryFilterProps {
  categories: Category[] | undefined;
  isLoading: boolean;
  selectedSlug: string | null;
  onSelect: (slug: string | null) => void;
}

const chipSx = {
  borderColor: 'divider',
  '& .MuiChip-label': {
    px: 1.5,
  },
} as const;

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
    <Box sx={{ mb: 3 }}>
      <Kicker sx={{ mb: 1.25 }}>Topics</Kicker>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Chip
          label="All"
          onClick={() => onSelect(null)}
          variant={selectedSlug === null ? 'filled' : 'outlined'}
          color={selectedSlug === null ? 'primary' : 'default'}
          size="small"
          sx={chipSx}
        />
        {categories.map((category) => (
          <Chip
            key={category.slug}
            label={category.name}
            onClick={() => onSelect(category.slug)}
            variant={selectedSlug === category.slug ? 'filled' : 'outlined'}
            color={selectedSlug === category.slug ? 'primary' : 'default'}
            size="small"
            sx={chipSx}
          />
        ))}
      </Box>
    </Box>
  );
};

import React from 'react';
import { Typography } from '@mui/material';
import { PageContainer } from '../components/common/PageContainer';
import { EmptyState } from '../components/common/EmptyState';

export const TrendingPage: React.FC = () => {
  return (
    <PageContainer>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Trending Stories
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Stories generating highest engagement and Pulse Scores.
      </Typography>
      <EmptyState
        title="No Trending Stories Yet"
        message="Trending algorithms and Pulse Score rankings will populate as articles are published."
        actionLabel="Explore Categories"
        actionPath="/explore"
      />
    </PageContainer>
  );
};

import React from 'react';
import { Typography } from '@mui/material';
import { PageContainer } from '../components/common/PageContainer';
import { EmptyState } from '../components/common/EmptyState';

export const ExplorePage: React.FC = () => {
  return (
    <PageContainer>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Explore
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Search stories, topics, and technical arguments.
      </Typography>
      <EmptyState
        title="Explore Stories"
        message="Search and filtering features will be activated in upcoming phases."
        actionLabel="Back to Home"
        actionPath="/"
      />
    </PageContainer>
  );
};

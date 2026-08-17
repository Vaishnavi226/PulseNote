import React from 'react';
import { Typography } from '@mui/material';
import { PageContainer } from '../components/common/PageContainer';
import { EmptyState } from '../components/common/EmptyState';

export const ChallengesPage: React.FC = () => {
  return (
    <PageContainer>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Discussions & Challenges
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Direct counterarguments, supporting evidence, and additions.
      </Typography>
      <EmptyState
        title="Challenge Feed"
        message="The structured Challenge feed will populate as community members challenge articles."
        actionLabel="Read Articles"
        actionPath="/"
      />
    </PageContainer>
  );
};

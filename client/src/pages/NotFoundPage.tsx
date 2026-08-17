import React from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { ErrorState } from '../components/common/ErrorState';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer>
      <ErrorState
        title="404 — Page Not Found"
        message="The story or page you are looking for does not exist or has been moved."
        onRetry={() => (window.location.href = '/')}
      />
    </PageContainer>
  );
};

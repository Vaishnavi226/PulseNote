import React from 'react';
import { Typography } from '@mui/material';
import { PageContainer } from '../components/common/PageContainer';
import { ArticleList } from '../features/articles/ArticleList';
import { useArticleList } from '../features/articles/hooks';

export const TrendingPage: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useArticleList({
    sort: 'popular',
    limit: 12,
  });

  return (
    <PageContainer>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Trending Stories
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Stories generating highest engagement and Pulse Scores.
      </Typography>

      <ArticleList
        articles={data?.articles}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        emptyTitle="No trending stories yet"
        emptyMessage="Trending algorithms and Pulse Score rankings will populate as articles are published."
      />
    </PageContainer>
  );
};

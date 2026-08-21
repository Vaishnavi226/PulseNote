import React from 'react';
import { Box } from '@mui/material';
import { ArticleCard } from './ArticleCard';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { ArticleSummary } from './types';

interface ArticleListProps {
  articles: ArticleSummary[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyMessage?: string;
  variant?: 'featured' | 'standard' | 'compact';
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  isLoading,
  isError,
  error,
  onRetry,
  emptyTitle = 'No articles found',
  emptyMessage = 'Check back later for new content.',
  variant = 'standard',
}) => {
  if (isLoading) {
    return <LoadingState message="Loading articles..." height={300} />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load articles"
        message={error?.message || 'Check your connection and try again.'}
        onRetry={onRetry}
      />
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
      />
    );
  }

  if (variant === 'featured') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="featured" />
        ))}
      </Box>
    );
  }

  if (variant === 'compact') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          '& > * + *': {
            borderTop: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} variant="compact" />
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        columnGap: { xs: 3, md: 3 },
        rowGap: { xs: 4, md: 4.5 },
      }}
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant="standard" />
      ))}
    </Box>
  );
};

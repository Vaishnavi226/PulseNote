import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { Kicker } from '../components/common/Kicker';
import { SectionHeader } from '../components/common/SectionHeader';
import { ArticleCard } from '../features/articles/ArticleCard';
import { ArticleList } from '../features/articles/ArticleList';
import { useArticleList } from '../features/articles/hooks';

const quietLinkSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  fontWeight: 600,
  fontSize: '0.875rem',
  color: 'text.primary',
  transition: 'color 160ms ease',
  '&:hover': {
    color: 'secondary.dark',
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
  },
} as const;

export const HomePage: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useArticleList({
    sort: 'latest',
    limit: 13,
  });

  const articles = data?.articles ?? [];
  const leadArticle = articles[0];
  const gridArticles = articles.slice(1, 7);
  const recentArticles = articles.slice(7, 11);

  const showLatestSection =
    isLoading || isError || gridArticles.length > 0 || articles.length === 0;

  return (
    <PageContainer>
      {/* ── Masthead ── */}
      <Box sx={{ pt: { xs: 3, md: 4 }, pb: { xs: 3, md: 5 }, maxWidth: 720 }}>
        <Kicker color="accent" sx={{ mb: 1.5 }}>
          Technology &amp; Digital Culture
        </Kicker>

        <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
          Read<Box component="span" sx={{ color: 'secondary.dark' }}>.</Box>{' '}
          Think<Box component="span" sx={{ color: 'secondary.dark' }}>.</Box>{' '}
          Challenge<Box component="span" sx={{ color: 'secondary.dark' }}>.</Box>
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 520, fontSize: { xs: '0.9375rem', md: '1.0625rem' }, lineHeight: 1.6, mb: 3 }}
        >
          PulseNote is a technology publication built for structured conversation
          — long-form ideas, honest argument, and room to push back.
        </Typography>

        <Box component={RouterLink} to="/explore" sx={quietLinkSx}>
          Explore stories
          <ArrowRight size={16} />
        </Box>
      </Box>

      {/* ── Featured story ── */}
      {leadArticle && (
        <ArticleCard article={leadArticle} variant="featured" />
      )}

      {/* ── Latest Stories ── */}
      {showLatestSection && (
        <Box sx={{ mt: { xs: 4, md: 5 } }}>
          <SectionHeader
            kicker="The Feed"
            title="Latest Stories"
            actionLabel="View all"
            actionTo="/explore"
          />

          <Box sx={{ mt: { xs: 2.5, md: 3 } }}>
            <ArticleList
              articles={gridArticles}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={refetch}
              emptyTitle="No stories yet"
              emptyMessage="Articles will appear here as they are published."
              variant="standard"
            />
          </Box>
        </Box>
      )}

      {/* ── Most Recent ── */}
      {recentArticles.length > 0 && (
        <Box sx={{ mt: { xs: 4, md: 5 }, maxWidth: 720 }}>
          <SectionHeader
            kicker="Just Published"
            title="Most Recent"
            headingVariant="h3"
          />

          <Box sx={{ mt: 0.5 }}>
            <ArticleList
              articles={recentArticles}
              isLoading={false}
              isError={false}
              error={null}
              variant="compact"
            />
          </Box>
        </Box>
      )}
    </PageContainer>
  );
};

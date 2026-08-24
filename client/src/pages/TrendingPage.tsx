import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer';
import { Kicker } from '../components/common/Kicker';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Byline } from '../features/articles/Byline';
import { useArticleList } from '../features/articles/hooks';
import { ArticleSummary } from '../features/articles/types';
import { tokens } from '../theme/tokens';

const clampLines = (lines: number) =>
  ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }) as const;

const formatRank = (rank: number) => String(rank).padStart(2, '0');

const RankNumerals: React.FC<{ rank: number }> = ({ rank }) => (
  <Typography
    aria-hidden
    sx={{
      fontFamily: tokens.fonts.ui,
      fontWeight: 700,
      fontSize: { xs: '0.75rem', md: '0.8125rem' },
      lineHeight: 1.7,
      letterSpacing: '0.08em',
      fontVariantNumeric: 'tabular-nums',
      color: 'text.muted',
      minWidth: { xs: '2.25rem', md: '3rem' },
      flexShrink: 0,
      pt: '2px',
    }}
  >
    {formatRank(rank)}
  </Typography>
);

const LeadStory: React.FC<{ article: ArticleSummary }> = ({ article }) => (
  <Box
    component={RouterLink}
    to={`/article/${article.slug}`}
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row-reverse' },
      alignItems: 'flex-start',
      gap: { xs: 3, md: 5 },
      py: { xs: 3.5, md: 5 },
      textDecoration: 'none',
      color: 'inherit',
      outlineOffset: 4,
      '&:hover .pn-trend-title': {
        color: 'secondary.dark',
      },
    }}
  >
    {article.coverImageUrl && (
      <Box
        sx={{
          width: { xs: '100%', md: '42%' },
          maxWidth: { md: 520 },
          aspectRatio: { xs: '16 / 10', md: '4 / 3' },
          borderRadius: tokens.radii.image,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Box
          component="img"
          src={article.coverImageUrl}
          alt={article.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </Box>
    )}

    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <RankNumerals rank={1} />
        <Kicker color="accent" component="span" sx={{ display: 'inline' }}>
          {article.category.name}
        </Kicker>
      </Box>

      <Typography
        className="pn-trend-title"
        component="h2"
        sx={{
          fontFamily: tokens.fonts.display,
          fontWeight: 600,
          fontSize: { xs: '2rem', md: 'clamp(2.25rem, 3.5vw, 3rem)' },
          lineHeight: 1.12,
          letterSpacing: '-0.015em',
          mb: 1.5,
          transition: 'color 160ms ease',
          ...clampLines(3),
        }}
      >
        {article.title}
      </Typography>

      {article.excerpt && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ ...clampLines(3), maxWidth: 640, mb: 2.5 }}
        >
          {article.excerpt}
        </Typography>
      )}

      <Byline author={article.author} publishedAt={article.publishedAt} />
    </Box>
  </Box>
);

interface RankedStoryProps {
  article: ArticleSummary;
  rank: number;
}

const RankedStory: React.FC<RankedStoryProps> = ({ article, rank }) => (
  <Box
    component="li"
    sx={{
      listStyle: 'none',
      '&:not(:first-of-type)': {
        borderTop: '1px solid',
        borderColor: 'divider',
      },
    }}
  >
    <Box
      component={RouterLink}
      to={`/article/${article.slug}`}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: { xs: 2, md: 3 },
        py: { xs: 3, md: 3.5 },
        textDecoration: 'none',
        color: 'inherit',
        outlineOffset: 4,
        '&:hover .pn-trend-title': {
          color: 'secondary.dark',
        },
      }}
    >
      <RankNumerals rank={rank} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.75 }}>
          {[
            article.category.name,
            article.author.name,
            `${article.readingTimeMin} min read`,
            `Pulse ${article.pulseScore}`,
          ].join(' · ')}
        </Typography>

        <Typography
          className="pn-trend-title"
          component="h3"
          sx={{
            fontFamily: tokens.fonts.display,
            fontWeight: 600,
            fontSize: { xs: '1.1875rem', md: '1.375rem' },
            lineHeight: 1.3,
            transition: 'color 160ms ease',
            ...clampLines(3),
          }}
        >
          {article.title}
        </Typography>

        {article.excerpt && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ...clampLines(2), mt: 1, maxWidth: 620 }}
          >
            {article.excerpt}
          </Typography>
        )}
      </Box>
    </Box>
  </Box>
);

export const TrendingPage: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useArticleList({
    sort: 'popular',
    limit: 12,
  });

  const articles = data?.articles ?? [];
  const leadArticle = articles[0];
  const rankedArticles = articles.slice(1);

  return (
    <PageContainer>
      <Box sx={{ pb: { xs: 4, md: 5 }, maxWidth: 860 }}>
        <Kicker color="accent" sx={{ mb: 2 }}>
          What’s Moving
        </Kicker>

        <Typography variant="h1" component="h1" sx={{ mb: 2.5 }}>
          Trending
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 560, fontSize: { xs: '1rem', md: '1.125rem' } }}
        >
          Stories gaining attention and momentum right now — surfaced from
          engagement, conversation, and Pulse Scores across the publication.
        </Typography>
      </Box>

      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />

      {isLoading && <LoadingState message="Loading articles..." height={300} />}

      {!isLoading && isError && (
        <ErrorState
          title="Failed to load articles"
          message={error?.message || 'Check your connection and try again.'}
          onRetry={refetch}
        />
      )}

      {!isLoading && !isError && articles.length === 0 && (
        <EmptyState
          title="No trending stories yet"
          message="Trending algorithms and Pulse Score rankings will populate as articles are published."
        />
      )}

      {!isLoading && !isError && articles.length > 0 && (
        <>
          {leadArticle && <LeadStory article={leadArticle} />}

          {rankedArticles.length > 0 && (
            <Box
              component="ol"
              sx={{
                m: 0,
                p: 0,
                maxWidth: 920,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}
            >
              {rankedArticles.map((article, index) => (
                <RankedStory
                  key={article.id}
                  article={article}
                  rank={index + 2}
                />
              ))}
            </Box>
          )}
        </>
      )}

      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: { xs: 3, md: 4 } }} />
    </PageContainer>
  );
};

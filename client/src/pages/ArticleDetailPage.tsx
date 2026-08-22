import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Chip, Divider } from '@mui/material';
import { ArrowLeft, Eye, MessageSquare, Zap } from 'lucide-react';
import { useArticleDetail } from '../features/articles/hooks';
import { PageContainer } from '../components/common/PageContainer';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Kicker } from '../components/common/Kicker';
import { Byline } from '../features/articles/Byline';
import { proseStyles } from '../features/articles/proseStyles';
import { tokens } from '../theme/tokens';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError, error, refetch } = useArticleDetail(slug || '');

  if (isLoading) {
    return (
      <PageContainer readingMeasure>
        <LoadingState message="Loading article..." height={400} />
      </PageContainer>
    );
  }

  if (isError || !article) {
    return (
      <PageContainer readingMeasure>
        <ErrorState
          title="Article not found"
          message={error?.message || 'The article you are looking for does not exist or has been removed.'}
          onRetry={() => refetch()}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box sx={{ maxWidth: 880, mx: 'auto', pt: { xs: 1, md: 2 } }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            color: 'text.secondary',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.9375rem',
            mb: { xs: 4, md: 5 },
            transition: 'color 160ms ease',
            '&:hover': {
              color: 'secondary.dark',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
            },
          }}
        >
          <ArrowLeft size={16} />
          Back to home
        </Box>

        <Box
          component={RouterLink}
          to={`/explore?category=${article.category.slug}`}
          sx={{
            display: 'inline-block',
            textDecoration: 'none',
            outlineOffset: 4,
            mb: 2,
          }}
        >
          <Kicker
            color="accent"
            component="span"
            sx={{
              transition: 'color 160ms ease',
              '&:hover': {
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
              },
            }}
          >
            {article.category.name}
          </Kicker>
        </Box>

        <Typography variant="h1" component="h1" sx={{ mb: { xs: 2.5, md: 3 } }}>
          {article.title}
        </Typography>

        {article.excerpt && (
          <Typography
            sx={{
              fontFamily: tokens.fonts.display,
              fontWeight: 400,
              fontSize: { xs: '1.1875rem', md: '1.3125rem' },
              lineHeight: 1.45,
              color: 'text.secondary',
              mb: { xs: 3.5, md: 4 },
            }}
          >
            {article.excerpt}
          </Typography>
        )}

        <Byline
          author={article.author}
          publishedAt={article.publishedAt}
          readingTimeMin={article.readingTimeMin}
          size="md"
        />

        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: { xs: 4, md: 5 } }} />
      </Box>

      {article.coverImageUrl && (
        <Box
          sx={{
            width: '100%',
            maxWidth: 1080,
            mx: 'auto',
            mt: { xs: 4, md: 6 },
            height: { xs: 240, sm: 360, md: 480 },
            borderRadius: tokens.radii.card,
            overflow: 'hidden',
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

      {article.quickTake && (
        <Box
          sx={{
            maxWidth: 720,
            mx: 'auto',
            mt: { xs: 4, md: 6 },
            borderLeft: '2px solid',
            borderColor: 'secondary.main',
            pl: { xs: 2.5, md: 3 },
            py: 0.25,
          }}
        >
          <Kicker color="accent" sx={{ mb: 0.5 }}>
            Quick Take
          </Kicker>
          <Typography
            sx={{
              fontFamily: tokens.fonts.display,
              fontStyle: 'italic',
              fontSize: '1.0625rem',
              lineHeight: 1.6,
              color: 'text.secondary',
              whiteSpace: 'pre-line',
            }}
          >
            {article.quickTake}
          </Typography>
        </Box>
      )}

      <Box sx={{ maxWidth: 720, mx: 'auto', mt: { xs: 4, md: 6 } }}>
        <Box sx={proseStyles}>{article.content}</Box>
      </Box>

      <Box sx={{ maxWidth: 720, mx: 'auto', mt: { xs: 5, md: 7 } }}>
        <Divider sx={{ mb: { xs: 3.5, md: 4 } }} />

        {article.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {article.tags.map((tag) => (
              <Chip key={tag.id} label={tag.name} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Eye size={16} />
            <Typography variant="caption">{article.views} views</Typography>
          </Box>
          {article.challengeCount > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <MessageSquare size={16} />
              <Typography variant="caption">{article.challengeCount} challenges</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Zap size={16} />
            <Typography variant="caption">Pulse {article.pulseScore}</Typography>
          </Box>
        </Box>
      </Box>
    </PageContainer>
  );
};

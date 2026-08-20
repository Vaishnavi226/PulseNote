import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Chip, Avatar, Divider } from '@mui/material';
import { ArrowLeft, Clock, Eye, MessageSquare, Zap } from 'lucide-react';
import { useArticleDetail } from '../features/articles/hooks';
import { PageContainer } from '../components/common/PageContainer';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

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

  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <PageContainer readingMeasure>
      <Box sx={{ mb: 4 }}>
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
            fontSize: '0.875rem',
            mb: 4,
            '&:hover': { color: 'primary.main' },
          }}
        >
          <ArrowLeft size={16} />
          Back to home
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            label={article.category.name.toUpperCase()}
            size="small"
            variant="outlined"
            component={RouterLink}
            to={`/explore?category=${article.category.slug}`}
            sx={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.05em', textDecoration: 'none' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <Clock size={14} />
            <Typography variant="caption">{article.readingTimeMin} min read</Typography>
          </Box>
          {formattedDate && (
            <Typography variant="caption" color="text.secondary">
              Published {formattedDate}
            </Typography>
          )}
        </Box>

        <Typography variant="h1" component="h1" sx={{ mb: 3, lineHeight: 1.15 }}>
          {article.title}
        </Typography>

        {article.excerpt && (
          <Typography variant="h4" color="text.secondary" sx={{ mb: 4, fontWeight: 400, lineHeight: 1.5 }}>
            {article.excerpt}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              bgcolor: 'secondary.main',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 700,
            }}
          >
            {article.author.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {article.author.name}
            </Typography>
            {article.author.bio && (
              <Typography variant="caption" color="text.secondary">
                {article.author.bio}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {article.coverImageUrl && (
        <Box
          sx={{
            width: '100%',
            height: { xs: 240, sm: 360, md: 440 },
            borderRadius: '20px',
            overflow: 'hidden',
            mb: 5,
          }}
        >
          <Box
            component="img"
            src={article.coverImageUrl}
            alt={article.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      )}

      {article.quickTake && (
        <Box
          sx={{
            p: 3.5,
            borderRadius: 3,
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
            mb: 5,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: 'secondary.main',
              letterSpacing: '0.05em',
              display: 'block',
              mb: 1,
            }}
          >
            QUICK TAKE
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
            {article.quickTake}
          </Typography>
        </Box>
      )}

      <Divider sx={{ mb: 5 }} />

      <Box
        sx={{
          typography: 'body1',
          lineHeight: 1.8,
          fontSize: '1.125rem',
          color: 'text.primary',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          '& h1': { fontSize: '2rem', fontWeight: 800, mt: 5, mb: 2, fontFamily: "'DM Sans', sans-serif" },
          '& h2': { fontSize: '1.5rem', fontWeight: 700, mt: 4, mb: 2, fontFamily: "'DM Sans', sans-serif" },
          '& h3': { fontSize: '1.25rem', fontWeight: 700, mt: 3, mb: 1.5, fontFamily: "'DM Sans', sans-serif" },
          '& p': { mb: 2.5 },
          '& strong': { fontWeight: 700 },
          '& ul, & ol': { pl: 4, mb: 2.5 },
          '& li': { mb: 0.5 },
          '& code': {
            fontFamily: 'monospace',
            fontSize: '0.9em',
            backgroundColor: 'action.hover',
            px: 0.8,
            py: 0.3,
            borderRadius: 1,
          },
          '& pre': {
            p: 3,
            borderRadius: 2,
            backgroundColor: 'action.hover',
            overflow: 'auto',
            mb: 2.5,
            '& code': { backgroundColor: 'transparent', px: 0, py: 0 },
          },
          '& blockquote': {
            borderLeft: '3px solid',
            borderColor: 'primary.main',
            pl: 3,
            ml: 0,
            my: 3,
            color: 'text.secondary',
            fontStyle: 'italic',
          },
        }}
      >
        {article.content}
      </Box>

      <Divider sx={{ my: 5 }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
        {article.tags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            size="small"
            variant="outlined"
            sx={{ borderRadius: '10px', fontWeight: 600 }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: 'text.secondary', mb: 6 }}>
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
    </PageContainer>
  );
};

import React from 'react';
import { Box, Typography, Paper, Chip, Avatar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Clock, MessageSquare } from 'lucide-react';
import { ArticleSummary } from './types';

interface ArticleCardProps {
  article: ArticleSummary;
  variant?: 'featured' | 'standard' | 'compact';
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
}) => {
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  if (variant === 'featured') {
    return (
      <Paper
        component={RouterLink}
        to={`/article/${article.slug}`}
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          p: { xs: 3, md: 4 },
          borderRadius: '28px',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          textDecoration: 'none',
          transition: 'all 200ms ease',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 8px 30px rgba(20, 22, 25, 0.06)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        {article.coverImageUrl && (
          <Box
            sx={{
              width: { xs: '100%', md: 320 },
              height: { xs: 200, md: 'auto' },
              minHeight: { md: 240 },
              borderRadius: '20px',
              overflow: 'hidden',
              flexShrink: 0,
              mb: { xs: 2, md: 0 },
              mr: { md: 4 },
            }}
          >
            <Box
              component="img"
              src={article.coverImageUrl}
              alt={article.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Chip
              label={article.category.name.toUpperCase()}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.05em' }}
            />
            <Typography variant="caption" color="text.secondary">
              {article.readingTimeMin} min read
              {article.challengeCount > 0 && ` • ${article.challengeCount} Challenges`}
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ mb: 1.5, lineHeight: 1.3 }}>
            {article.title}
          </Typography>

          {article.excerpt && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              {article.excerpt}
            </Typography>
          )}

          {article.quickTake && (
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                mt: 'auto',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: 'secondary.main',
                  letterSpacing: '0.05em',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                QUICK TAKE
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
                {article.quickTake}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: 'secondary.main',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {article.author.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {article.author.name}
            </Typography>
            {formattedDate && (
              <Typography variant="caption" color="text.muted">
                • {formattedDate}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    );
  }

  if (variant === 'compact') {
    return (
      <Paper
        component={RouterLink}
        to={`/article/${article.slug}`}
        elevation={0}
        sx={{
          display: 'flex',
          gap: 2,
          p: 2,
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          textDecoration: 'none',
          transition: 'all 180ms ease',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 4px 16px rgba(20, 22, 25, 0.04)',
          },
        }}
      >
        {article.coverImageUrl && (
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '10px',
              overflow: 'hidden',
              flexShrink: 0,
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

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {article.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {article.author.name} • {article.readingTimeMin} min
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      component={RouterLink}
      to={`/article/${article.slug}`}
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '18px',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        overflow: 'hidden',
        textDecoration: 'none',
        transition: 'all 200ms ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 12px 40px rgba(20, 22, 25, 0.06)',
          transform: 'translateY(-3px)',
        },
      }}
    >
      {article.coverImageUrl && (
        <Box
          sx={{
            width: '100%',
            height: 200,
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={article.coverImageUrl}
            alt={article.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 300ms ease',
              '&:hover': { transform: 'scale(1.03)' },
            }}
          />
        </Box>
      )}

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Chip
            label={article.category.name.toUpperCase()}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.05em' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
            <Clock size={12} />
            <Typography variant="caption">{article.readingTimeMin} min</Typography>
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            mb: 1,
            lineHeight: 1.35,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {article.title}
        </Typography>

        {article.excerpt && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              lineHeight: 1.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              flex: 1,
            }}
          >
            {article.excerpt}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: 'secondary.main',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 700,
              }}
            >
              {article.author.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {article.author.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.muted' }}>
            {article.commentCount > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <MessageSquare size={12} />
                <Typography variant="caption">{article.commentCount}</Typography>
              </Box>
            )}
            {formattedDate && (
              <Typography variant="caption">{formattedDate}</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

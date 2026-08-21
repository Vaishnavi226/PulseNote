import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { tokens } from '../../theme/tokens';
import { ArticleSummary } from './types';
import { Kicker } from '../../components/common/Kicker';
import { Byline } from './Byline';

interface ArticleCardProps {
  article: ArticleSummary;
  variant?: 'featured' | 'standard' | 'compact';
}

const clampLines = (lines: number) =>
  ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }) as const;

const MetaRow: React.FC<{ article: ArticleSummary }> = ({ article }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.25 }}>
    <Kicker color="accent" component="span" sx={{ display: 'inline' }}>
      {article.category.name}
    </Kicker>
    <Box
      component="span"
      sx={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'text.muted' }}
    />
    <Typography variant="caption">{article.readingTimeMin} min read</Typography>
  </Box>
);

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
}) => {
  if (variant === 'featured') {
    return (
      <Box
        component={RouterLink}
        to={`/article/${article.slug}`}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: { xs: 2.5, md: 4 },
          borderTop: '1px solid',
          borderColor: 'divider',
          py: { xs: 3, md: 4 },
          textDecoration: 'none',
          color: 'inherit',
          outlineOffset: 4,
          '&:hover .pn-card-title': {
            color: 'secondary.dark',
          },
          '&:hover .pn-card-img': {
            transform: 'scale(1.02)',
          },
        }}
      >
        {article.coverImageUrl && (
          <Box
            sx={{
              width: { xs: '100%', md: '42%' },
              maxWidth: { md: 520 },
              aspectRatio: { xs: '16 / 10', md: '4 / 3' },
              borderRadius: tokens.radii.card,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <Box
              className="pn-card-img"
              component="img"
              src={article.coverImageUrl}
              alt={article.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 300ms ease',
              }}
            />
          </Box>
        )}

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <MetaRow article={article} />

          <Typography
            className="pn-card-title"
            variant="h2"
            component="h2"
            sx={{ ...clampLines(3), transition: 'color 160ms ease' }}
          >
            {article.title}
          </Typography>

          {article.excerpt && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ ...clampLines(3), mt: 1.5, maxWidth: 640 }}
            >
              {article.excerpt}
            </Typography>
          )}

          {article.quickTake && (
            <Box
              sx={{
                borderLeft: '2px solid',
                borderColor: 'secondary.main',
                pl: 2.5,
                py: 0.25,
                mt: 2.5,
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

          <Box sx={{ mt: 'auto', pt: 3 }}>
            <Byline author={article.author} publishedAt={article.publishedAt} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (variant === 'compact') {
    return (
      <Box
        component={RouterLink}
        to={`/article/${article.slug}`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          py: 2.5,
          textDecoration: 'none',
          color: 'inherit',
          outlineOffset: 4,
          '&:hover .pn-card-title': {
            color: 'secondary.dark',
          },
          '&:hover .pn-card-img': {
            transform: 'scale(1.04)',
          },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            className="pn-card-title"
            component="h3"
            sx={{
              fontFamily: tokens.fonts.display,
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: 1.35,
              transition: 'color 160ms ease',
              ...clampLines(2),
            }}
          >
            {article.title}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 0.75 }}>
            {article.author.name} · {article.readingTimeMin} min read
          </Typography>
        </Box>

        {article.coverImageUrl && (
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: tokens.radii.control,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <Box
              className="pn-card-img"
              component="img"
              src={article.coverImageUrl}
              alt={article.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 300ms ease',
              }}
            />
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box
      component={RouterLink}
      to={`/article/${article.slug}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        textDecoration: 'none',
        color: 'inherit',
        outlineOffset: 4,
        '&:hover .pn-card-title': {
          color: 'secondary.dark',
        },
        '&:hover .pn-card-img': {
          transform: 'scale(1.02)',
        },
      }}
    >
      {article.coverImageUrl && (
        <Box
          sx={{
            width: '100%',
            aspectRatio: '3 / 2',
            borderRadius: tokens.radii.card,
            overflow: 'hidden',
            mb: 2,
            backgroundColor: 'action.hover',
          }}
        >
          <Box
            className="pn-card-img"
            component="img"
            src={article.coverImageUrl}
            alt={article.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 300ms ease',
            }}
          />
        </Box>
      )}

      <MetaRow article={article} />

      <Typography
        className="pn-card-title"
        variant="h4"
        component="h3"
        sx={{ ...clampLines(3), transition: 'color 160ms ease' }}
      >
        {article.title}
      </Typography>

      {article.excerpt && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ...clampLines(2), mt: 1 }}
        >
          {article.excerpt}
        </Typography>
      )}

      <Box sx={{ mt: 'auto', pt: 2.5 }}>
        <Byline author={article.author} publishedAt={article.publishedAt} />
      </Box>
    </Box>
  );
};

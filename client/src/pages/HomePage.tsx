import React from 'react';
import { Box, Typography, Avatar, Skeleton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { useArticleList } from '../features/articles/hooks';
import { ArticleSummary } from '../features/articles/types';
import { usePulseTheme } from '../theme/ThemeProvider';

/* ── Helpers ── */

const clampLines = (lines: number) =>
  ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }) as const;

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'July 20, 2026';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/* ══════════════════════════════════════════════════
   1. FEATURED CAROUSEL (Full-Width Hero)
   ══════════════════════════════════════════════════ */

const FeaturedCarousel: React.FC<{ articles: ArticleSummary[] }> = ({ articles }) => {
  const [current, setCurrent] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const displayArticles = articles.length > 0 ? articles.slice(0, 5) : [];

  React.useEffect(() => {
    if (displayArticles.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % displayArticles.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [displayArticles.length, isPaused]);

  if (displayArticles.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        sx={{
          fontSize: '15px',
          fontWeight: 700,
          color: 'text.primary',
          mb: 1.5,
        }}
      >
        Featured
      </Typography>

      <Box
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 360, sm: 380, md: 310 },
          borderRadius: '6px',
          overflow: 'hidden',
          backgroundColor: '#050505',
        }}
      >
        {displayArticles.map((article, idx) => (
          <Box
            key={article.id}
            component={RouterLink}
            to={`/article/${article.slug}`}
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              opacity: idx === current ? 1 : 0,
              pointerEvents: idx === current ? 'auto' : 'none',
              transition: 'opacity 500ms ease',
              zIndex: idx === current ? 1 : 0,
            }}
          >
            {article.coverImageUrl && (
              <Box
                component="img"
                src={article.coverImageUrl}
                alt={article.title}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}

            {/* Left to right dark gradient overlay */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.6) 48%, rgba(0,0,0,0.15) 100%)',
                zIndex: 1,
              }}
            />

            {/* Left side text overlay */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                top: 0,
                zIndex: 2,
                p: { xs: 3, sm: 4, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                maxWidth: { xs: '100%', md: 520 },
              }}
            >
              <Typography
                sx={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#2385D8',
                  mb: 1,
                }}
              >
                {article.category?.name || 'BLOCKCHAIN'}
              </Typography>

              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '20px', sm: '24px', md: '26px' },
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: '#FFFFFF',
                  mb: 1.25,
                  ...clampLines(2),
                }}
              >
                {article.title}
              </Typography>

              {article.excerpt && (
                <Typography
                  sx={{
                    fontSize: '13px',
                    lineHeight: 1.45,
                    color: 'rgba(255,255,255,0.85)',
                    mb: 2,
                    ...clampLines(2),
                    display: { xs: 'none', sm: '-webkit-box' },
                  }}
                >
                  {article.excerpt}
                </Typography>
              )}

              {/* Byline */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar
                  src={article.author?.avatarUrl || undefined}
                  sx={{ width: 20, height: 20, fontSize: '10px', bgcolor: '#2385D8' }}
                >
                  {article.author?.name?.charAt(0) || 'A'}
                </Avatar>
                <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                  {article.author?.name || 'Ahmad Rayan'}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                  • {formatDate(article.publishedAt)} • {article.readingTimeMin || 5} min read
                </Typography>
              </Box>

              {/* Read More button */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 600,
                  width: 'fit-content',
                  transition: 'all 160ms ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    borderColor: 'rgba(255,255,255,0.6)',
                  },
                }}
              >
                Read More
                <ArrowRight size={12} />
              </Box>
            </Box>
          </Box>
        ))}

        {/* Previous / Next Arrow Controls */}
        {displayArticles.length > 1 && (
          <>
            <Box
              component="button"
              aria-label="Previous slide"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrent((prev) => (prev - 1 + displayArticles.length) % displayArticles.length);
              }}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 12,
                transform: 'translateY(-50%)',
                zIndex: 3,
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.45)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 160ms ease',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.75)' },
              }}
            >
              <ChevronLeft size={16} />
            </Box>

            <Box
              component="button"
              aria-label="Next slide"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrent((prev) => (prev + 1) % displayArticles.length);
              }}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 12,
                transform: 'translateY(-50%)',
                zIndex: 3,
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.45)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 160ms ease',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.75)' },
              }}
            >
              <ChevronRight size={16} />
            </Box>
          </>
        )}

        {/* Pagination Dots */}
        {displayArticles.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {displayArticles.map((_, i) => (
              <Box
                key={i}
                component="button"
                aria-label={`Slide ${i + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrent(i);
                }}
                sx={{
                  width: i === current ? 8 : 6,
                  height: i === current ? 8 : 6,
                  borderRadius: '50%',
                  border: 'none',
                  p: 0,
                  cursor: 'pointer',
                  backgroundColor: i === current ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                  transition: 'all 200ms ease',
                  '&:hover': { backgroundColor: '#FFFFFF' },
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════════
   2. LATEST NEWS (3-Column Grid)
   ══════════════════════════════════════════════════ */

const LatestNewsCard: React.FC<{ article: ArticleSummary }> = ({ article }) => {
  const { mode } = usePulseTheme();
  return (
    <Box
      component={RouterLink}
      to={`/article/${article.slug}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        p: '10px',
        borderRadius: '6px',
        border: '1px solid',
        borderColor: mode === 'light' ? '#E8E8E8' : 'divider',
        backgroundColor: mode === 'light' ? '#FFFFFF' : '#181A1E',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          '& .latest-title': { color: '#1677D2' },
        },
      }}
    >
      {article.coverImageUrl && (
        <Box
          sx={{
            width: '100%',
            aspectRatio: '1.8 / 1',
            borderRadius: '5px',
            overflow: 'hidden',
            mb: 1.25,
            backgroundColor: '#F0F0F0',
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

      <Typography
        sx={{
          fontSize: '10px',
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#1677D2',
          mb: 0.5,
          letterSpacing: '0.04em',
        }}
      >
        {article.category?.name || 'BLOCKCHAIN'}
      </Typography>

      <Typography
        className="latest-title"
        component="h3"
        sx={{
          fontSize: '13px',
          fontWeight: 700,
          lineHeight: 1.3,
          color: mode === 'light' ? '#0B1020' : '#FFFFFF',
          mb: 1.25,
          transition: 'color 160ms ease',
          ...clampLines(2),
        }}
      >
        {article.title}
      </Typography>

      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: '10px', color: '#777' }}>
          by {article.author?.name || 'Author'}
        </Typography>
        <Typography sx={{ fontSize: '10px', color: '#777' }}>
          {formatDate(article.publishedAt)}
        </Typography>
      </Box>
    </Box>
  );
};

const LatestNewsSection: React.FC<{ articles: ArticleSummary[] }> = ({ articles }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary' }}>
          Latest News
        </Typography>
        <Typography
          component={RouterLink}
          to="/explore"
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#1677D2',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View more →
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
          gap: '14px',
        }}
      >
        {articles.slice(0, 6).map((article) => (
          <LatestNewsCard key={article.id} article={article} />
        ))}
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════════
   3. TRENDING NOW (Sidebar Numbered List)
   ══════════════════════════════════════════════════ */

const TrendingItem: React.FC<{ article: ArticleSummary; index: number }> = ({ article, index }) => {
  const { mode } = usePulseTheme();
  const numStr = String(index + 1).padStart(2, '0');

  return (
    <Box
      component={RouterLink}
      to={`/article/${article.slug}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 1.25,
        borderBottom: '1px solid',
        borderColor: mode === 'light' ? '#EAEAEA' : 'divider',
        textDecoration: 'none',
        color: 'inherit',
        '&:last-child': { borderBottom: 'none' },
        '&:hover .trend-title': { color: '#1677D2' },
      }}
    >
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 800,
          color: mode === 'light' ? '#0B1020' : '#FFFFFF',
          minWidth: '22px',
        }}
      >
        {numStr}
      </Typography>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          className="trend-title"
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: 1.3,
            color: mode === 'light' ? '#0B1020' : '#FFFFFF',
            mb: 0.25,
            transition: 'color 160ms ease',
            ...clampLines(2),
          }}
        >
          {article.title}
        </Typography>
        <Typography sx={{ fontSize: '9px', color: '#777' }}>
          {formatDate(article.publishedAt)}
        </Typography>
      </Box>

      {article.coverImageUrl && (
        <Box
          sx={{
            width: 72,
            height: 50,
            borderRadius: '4px',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: '#F0F0F0',
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
    </Box>
  );
};

const TrendingSidebar: React.FC<{ articles: ArticleSummary[] }> = ({ articles }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
        Trending Now
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {articles.slice(0, 5).map((article, idx) => (
          <TrendingItem key={article.id} article={article} index={idx} />
        ))}
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════════
   4. ADOPTION SECTION (Compact Horizontal Cards)
   ══════════════════════════════════════════════════ */

const AdoptionItem: React.FC<{ article: ArticleSummary }> = ({ article }) => {
  const { mode } = usePulseTheme();

  return (
    <Box
      component={RouterLink}
      to={`/article/${article.slug}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: '10px',
        borderRadius: '6px',
        border: '1px solid',
        borderColor: mode === 'light' ? '#E8E8E8' : 'divider',
        backgroundColor: mode === 'light' ? '#FFFFFF' : '#181A1E',
        textDecoration: 'none',
        color: 'inherit',
        '&:hover .adopt-title': { color: '#1677D2' },
      }}
    >
      {article.coverImageUrl && (
        <Box
          sx={{
            width: 75,
            height: 75,
            borderRadius: '5px',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: '#F0F0F0',
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
          sx={{
            fontSize: '9px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#1677D2',
            mb: 0.25,
          }}
        >
          {article.category?.name || 'ADOPTION'}
        </Typography>

        <Typography
          className="adopt-title"
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            lineHeight: 1.3,
            color: mode === 'light' ? '#0B1020' : '#FFFFFF',
            mb: 0.5,
            transition: 'color 160ms ease',
            ...clampLines(2),
          }}
        >
          {article.title}
        </Typography>

        <Typography sx={{ fontSize: '9px', color: '#777' }}>
          By {article.author?.name || 'Author'} • {formatDate(article.publishedAt)}
        </Typography>
      </Box>
    </Box>
  );
};

const AdoptionSection: React.FC<{ articles: ArticleSummary[] }> = ({ articles }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary' }}>
          Adoption
        </Typography>
        <Typography
          component={RouterLink}
          to="/explore"
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#1677D2',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View more →
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: '14px',
        }}
      >
        {articles.slice(0, 3).map((article) => (
          <AdoptionItem key={article.id} article={article} />
        ))}
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════════
   5. ALTCOIN NEWS (Compact Editorial List)
   ══════════════════════════════════════════════════ */

const AltcoinRow: React.FC<{ article: ArticleSummary }> = ({ article }) => {
  const { mode } = usePulseTheme();

  return (
    <Box
      component={RouterLink}
      to={`/article/${article.slug}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: mode === 'light' ? '#E7E7E7' : 'divider',
        textDecoration: 'none',
        color: 'inherit',
        '&:last-child': { borderBottom: 'none' },
        '&:hover .alt-title': { color: '#1677D2' },
      }}
    >
      {article.coverImageUrl && (
        <Box
          sx={{
            width: 90,
            height: 55,
            borderRadius: '5px',
            overflow: 'hidden',
            flexShrink: 0,
            backgroundColor: '#F0F0F0',
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
          className="alt-title"
          sx={{
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: 1.3,
            color: mode === 'light' ? '#0B1020' : '#FFFFFF',
            mb: 0.25,
            transition: 'color 160ms ease',
            ...clampLines(1),
          }}
        >
          {article.title}
        </Typography>

        <Typography sx={{ fontSize: '10px', color: '#777' }}>
          by {article.author?.name || 'Author'} • {formatDate(article.publishedAt)} • {article.readingTimeMin || 5} min read
        </Typography>
      </Box>
    </Box>
  );
};

const AltcoinNewsSection: React.FC<{ articles: ArticleSummary[] }> = ({ articles }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
        Altcoin News
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {articles.slice(0, 3).map((article) => (
          <AltcoinRow key={article.id} article={article} />
        ))}
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════════
   6. WEB STORIES (Sidebar Image Carousel)
   ══════════════════════════════════════════════════ */

const WebStoriesCarousel: React.FC<{ articles: ArticleSummary[] }> = ({ articles }) => {
  const [current, setCurrent] = React.useState(0);
  const displayArticles = articles.length > 0 ? articles.slice(0, 5) : [];

  if (displayArticles.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
        Web Stories
      </Typography>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 210,
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#050505',
        }}
      >
        {displayArticles.map((article, idx) => (
          <Box
            key={article.id}
            component={RouterLink}
            to={`/article/${article.slug}`}
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'block',
              textDecoration: 'none',
              color: 'inherit',
              opacity: idx === current ? 1 : 0,
              pointerEvents: idx === current ? 'auto' : 'none',
              transition: 'opacity 400ms ease',
              zIndex: idx === current ? 1 : 0,
            }}
          >
            {article.coverImageUrl && (
              <Box
                component="img"
                src={article.coverImageUrl}
                alt={article.title}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}

            {/* Gradient overlay */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                zIndex: 1,
              }}
            />

            {/* Content overlay */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2,
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '9px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#2385D8',
                  mb: 0.5,
                }}
              >
                {article.category?.name || 'EXCHANGE'}
              </Typography>

              <Typography
                component="h4"
                sx={{
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: 1.25,
                  color: '#FFFFFF',
                  mb: 1,
                  ...clampLines(3),
                }}
              >
                {article.title}
              </Typography>

              <Typography sx={{ fontSize: '10px', color: 'rgba(255,255,255,0.7)' }}>
                {formatDate(article.publishedAt)}
              </Typography>
            </Box>
          </Box>
        ))}

        {/* Controls */}
        {displayArticles.length > 1 && (
          <>
            <Box
              component="button"
              aria-label="Previous story"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrent((prev) => (prev - 1 + displayArticles.length) % displayArticles.length);
              }}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 8,
                transform: 'translateY(-50%)',
                zIndex: 3,
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.4)',
                border: 'none',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={14} />
            </Box>

            <Box
              component="button"
              aria-label="Next story"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrent((prev) => (prev + 1) % displayArticles.length);
              }}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 8,
                transform: 'translateY(-50%)',
                zIndex: 3,
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.4)',
                border: 'none',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <ChevronRight size={14} />
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              {displayArticles.map((_, i) => (
                <Box
                  key={i}
                  component="button"
                  aria-label={`Story slide ${i + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrent(i);
                  }}
                  sx={{
                    width: i === current ? 6 : 4,
                    height: i === current ? 6 : 4,
                    borderRadius: '50%',
                    border: 'none',
                    p: 0,
                    cursor: 'pointer',
                    backgroundColor: i === current ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════════
   7. MARKET NEWS (2-Column Minimal Editorial List)
   ══════════════════════════════════════════════════ */

const MarketNewsItem: React.FC<{ article: ArticleSummary }> = ({ article }) => {
  const { mode } = usePulseTheme();

  return (
    <Box
      component={RouterLink}
      to={`/article/${article.slug}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        py: 1,
        textDecoration: 'none',
        color: 'inherit',
        '&:hover .market-title': { color: '#1677D2' },
      }}
    >
      <Typography
        className="market-title"
        sx={{
          fontSize: '13px',
          fontWeight: 600,
          lineHeight: 1.35,
          color: mode === 'light' ? '#0B1020' : '#FFFFFF',
          mb: 0.5,
          transition: 'color 160ms ease',
          ...clampLines(2),
        }}
      >
        {article.title}
      </Typography>

      <Typography sx={{ fontSize: '10px', color: '#777' }}>
        {formatDate(article.publishedAt)} • {article.readingTimeMin || 5} min read
      </Typography>
    </Box>
  );
};

const MarketNewsSection: React.FC<{ articles: ArticleSummary[] }> = ({ articles }) => {
  const half = Math.ceil(articles.length / 2);
  const col1 = articles.slice(0, half);
  const col2 = articles.slice(half, 6);

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary' }}>
          Market News
        </Typography>
        <Typography
          component={RouterLink}
          to="/explore"
          sx={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#1677D2',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          View more →
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {col1.map((article) => (
            <MarketNewsItem key={article.id} article={article} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {col2.map((article) => (
            <MarketNewsItem key={article.id} article={article} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════════
   HOMEPAGE CONTAINER
   ══════════════════════════════════════════════════ */

export const HomePage: React.FC = () => {
  const { data: latestData, isLoading: latestLoading } = useArticleList({
    sort: 'latest',
    limit: 25,
  });

  const { data: popularData } = useArticleList({
    sort: 'popular',
    limit: 10,
  });

  const allArticles = latestData?.articles || [];
  const popularArticles = popularData?.articles || [];

  // Frontend data slicing to ensure real content for all sections
  const featuredArticles = allArticles.slice(0, 5);
  const latestNewsArticles = allArticles.slice(0, 6);
  const trendingArticles = popularArticles.length >= 5 ? popularArticles.slice(0, 5) : allArticles.slice(4, 9);
  const adoptionArticles = allArticles.slice(6, 9);
  const altcoinArticles = allArticles.slice(9, 12);
  const webStoriesArticles = allArticles.slice(2, 7);
  const marketArticles = allArticles.slice(12, 18);

  if (latestLoading && allArticles.length === 0) {
    return (
      <PageContainer>
        <Box sx={{ py: 4 }}>
          <Skeleton variant="rectangular" width="100%" height={310} sx={{ borderRadius: '6px', mb: 4 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 3fr' }, gap: 3 }}>
            <Box>
              <Skeleton variant="rectangular" width="100%" height={200} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Box>
            <Box>
              <Skeleton variant="rectangular" width="100%" height={400} />
            </Box>
          </Box>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Featured Full-Width Carousel */}
      <FeaturedCarousel articles={featuredArticles} />

      {/* Main Content (70%) + Sidebar (30%) Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 7fr) minmax(280px, 3fr)' },
          gap: { xs: 3, md: '28px' },
          alignItems: 'start',
        }}
      >
        {/* Main Column */}
        <Box sx={{ minWidth: 0 }}>
          {/* Latest News */}
          <LatestNewsSection articles={latestNewsArticles} />

          {/* Adoption */}
          <AdoptionSection articles={adoptionArticles} />

          {/* Altcoin News */}
          <AltcoinNewsSection articles={altcoinArticles} />

          {/* Market News */}
          <MarketNewsSection articles={marketArticles} />
        </Box>

        {/* Sidebar */}
        <Box sx={{ minWidth: 0 }}>
          {/* Trending Now */}
          <TrendingSidebar articles={trendingArticles} />

          {/* Web Stories */}
          <WebStoriesCarousel articles={webStoriesArticles} />
        </Box>
      </Box>
    </PageContainer>
  );
};


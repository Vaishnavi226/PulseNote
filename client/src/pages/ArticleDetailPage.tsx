import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Chip } from '@mui/material';
import { ArrowLeft, Eye, MessageSquare, Zap, Heart, Bookmark } from 'lucide-react';
import { useArticleDetail, useArticleList } from '../features/articles/hooks';
import { PageContainer } from '../components/common/PageContainer';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Kicker } from '../components/common/Kicker';
import { Byline } from '../features/articles/Byline';
import { proseStyles } from '../features/articles/proseStyles';
import { ArticleSummary } from '../features/articles/types';
import { tokens } from '../theme/tokens';

const clampLines = (lines: number) =>
  ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  }) as const;

/* ────────────────────────────────────────────────────
   Sidebar – Trending row (compact, ranked feel)
   ──────────────────────────────────────────────────── */
const SidebarArticleRow: React.FC<{ article: ArticleSummary }> = ({ article }) => (
  <Box
    component={RouterLink}
    to={`/article/${article.slug}`}
    sx={{
      display: 'flex',
      gap: 1.25,
      py: 1.25,
      textDecoration: 'none',
      color: 'inherit',
      outlineOffset: 4,
      '&:hover .pn-sidebar-title': { color: 'secondary.dark' },
    }}
  >
    {article.coverImageUrl && (
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '4px',
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
      <Typography
        variant="caption"
        sx={{ display: 'block', mb: 0.25, fontWeight: 600, lineHeight: 1.4 }}
      >
        {article.category.name}
      </Typography>
      <Typography
        className="pn-sidebar-title"
        sx={{
          fontFamily: tokens.fonts.display,
          fontWeight: 600,
          fontSize: '0.875rem',
          lineHeight: 1.3,
          transition: 'color 160ms ease',
          ...clampLines(2),
        }}
      >
        {article.title}
      </Typography>
    </Box>
  </Box>
);

/* ────────────────────────────────────────────────────
   Sidebar – Recommendation row (compact editorial)
   ──────────────────────────────────────────────────── */
const SidebarRecommendation: React.FC<{ article: ArticleSummary }> = ({ article }) => (
  <Box
    component={RouterLink}
    to={`/article/${article.slug}`}
    sx={{
      display: 'flex',
      gap: 1.25,
      py: 1.25,
      textDecoration: 'none',
      color: 'inherit',
      outlineOffset: 4,
      '&:hover .pn-rec-title': { color: 'secondary.dark' },
    }}
  >
    {article.coverImageUrl && (
      <Box
        sx={{
          width: 64,
          height: 48,
          borderRadius: '4px',
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
      <Typography
        variant="caption"
        sx={{ display: 'block', mb: 0.25, fontWeight: 600, lineHeight: 1.4 }}
      >
        {article.category.name}
      </Typography>
      <Typography
        className="pn-rec-title"
        sx={{
          fontFamily: tokens.fonts.display,
          fontWeight: 600,
          fontSize: '0.875rem',
          lineHeight: 1.3,
          transition: 'color 160ms ease',
          ...clampLines(2),
        }}
      >
        {article.title}
      </Typography>
    </Box>
  </Box>
);

/* ────────────────────────────────────────────────────
   Sidebar section wrapper (title + hairline rail)
   ──────────────────────────────────────────────────── */
const SidebarSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <Box>
    <Typography
      variant="overline"
      sx={{ display: 'block', color: 'text.muted', mb: 0.5 }}
    >
      {title}
    </Typography>
    <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
      {children}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />
    </Box>
  </Box>
);

/* ────────────────────────────────────────────────────
   Stat pill (icon + label)
   ──────────────────────────────────────────────────── */
const StatItem: React.FC<{
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ icon, children }) => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
    {icon}
    <Typography variant="caption">{children}</Typography>
  </Box>
);

/* ────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────── */
export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError, error, refetch } = useArticleDetail(slug || '');

  const { data: trendingData } = useArticleList({ sort: 'popular', limit: 6 });
  const { data: recData } = useArticleList({ sort: 'pulse', limit: 5 });

  const trendingArticles = (trendingData?.articles ?? [])
    .filter((a) => a.slug !== slug)
    .slice(0, 5);
  const recArticles = (recData?.articles ?? [])
    .filter((a) => a.slug !== slug)
    .slice(0, 4);

  /* ── Loading / Error states ── */
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

  /* ── Sidebar content (shared between desktop & mobile) ── */
  const sidebarContent = (
    <>
      {trendingArticles.length > 0 && (
        <SidebarSection title="Trending">
          {trendingArticles.map((a) => (
            <SidebarArticleRow key={a.id} article={a} />
          ))}
        </SidebarSection>
      )}

      {recArticles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <SidebarSection title="Top Recommendations">
            {recArticles.map((a) => (
              <SidebarRecommendation key={a.id} article={a} />
            ))}
          </SidebarSection>
        </Box>
      )}
    </>
  );

  return (
    <PageContainer>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '7fr 3fr' },
          gap: { xs: 0, lg: 5 },
          pt: { xs: 1, md: 2 },
          alignItems: 'start',
        }}
      >
        {/* ── Main Article Column ── */}
        <Box sx={{ minWidth: 0 }}>
          {/* Back nav */}
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
              mb: { xs: 2.5, md: 3 },
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

          {/* Category kicker */}
          <Box
            component={RouterLink}
            to={`/explore?category=${article.category.slug}`}
            sx={{
              display: 'inline-block',
              textDecoration: 'none',
              outlineOffset: 4,
              mb: 1,
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

          {/* Headline */}
          <Typography variant="h1" component="h1" sx={{ mb: { xs: 1.25, md: 1.5 } }}>
            {article.title}
          </Typography>

          {/* Dek */}
          {article.excerpt && (
            <Typography
              sx={{
                fontFamily: tokens.fonts.display,
                fontWeight: 400,
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                lineHeight: 1.45,
                color: 'text.secondary',
                mb: { xs: 1.5, md: 2 },
              }}
            >
              {article.excerpt}
            </Typography>
          )}

          {/* Byline */}
          <Byline
            author={article.author}
            publishedAt={article.publishedAt}
            readingTimeMin={article.readingTimeMin}
            size="md"
          />

          {/* Hairline */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: { xs: 2, md: 2.5 } }} />

          {/* Cover image — aspect-ratio driven, spans full main column */}
          {article.coverImageUrl && (
            <Box
              sx={{
                width: '100%',
                mt: { xs: 2, md: 2.5 },
                aspectRatio: '16 / 9',
                maxHeight: { md: 480 },
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

          {/* Quick Take */}
          {article.quickTake && (
            <Box
              sx={{
                mt: { xs: 2.5, md: 3 },
                borderLeft: '2px solid',
                borderColor: 'secondary.main',
                pl: { xs: 2, md: 2.5 },
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

          {/* Article body — constrained reading measure */}
          <Box
            sx={{
              mt: { xs: 2.5, md: 3 },
              maxWidth: 680,
            }}
          >
            <Box sx={proseStyles}>{article.content}</Box>
          </Box>

          {/* FAQ Section */}
          {article.faqs && article.faqs.length > 0 && (
            <Box sx={{ mt: { xs: 4, md: 5 }, maxWidth: 680 }}>
              <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mb: { xs: 3, md: 3.5 } }} />
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: tokens.fonts.display,
                  fontSize: { xs: '1.375rem', md: '1.5rem' },
                  fontWeight: 600,
                  mb: { xs: 2.5, md: 3 },
                }}
              >
                Frequently Asked Questions
              </Typography>
              <Box component="dl" sx={{ m: 0 }}>
                {article.faqs.map((faq, index) => (
                  <Box
                    key={index}
                    component="div"
                    sx={{
                      '&:not(:first-of-type)': {
                        borderTop: '1px solid',
                        borderColor: 'divider',
                      },
                    }}
                  >
                    <Box
                      component="dt"
                      sx={{
                        fontFamily: tokens.fonts.display,
                        fontWeight: 600,
                        fontSize: '1.0625rem',
                        lineHeight: 1.4,
                        pt: { xs: 2.5, md: 3 },
                        pb: 1,
                        color: 'text.primary',
                      }}
                    >
                      {faq.question}
                    </Box>
                    <Box
                      component="dd"
                      sx={{
                        m: 0,
                        pb: { xs: 2.5, md: 3 },
                        fontFamily: tokens.fonts.ui,
                        fontSize: '0.9375rem',
                        lineHeight: 1.65,
                        color: 'text.secondary',
                      }}
                    >
                      {faq.answer}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Tags + Engagement */}
          <Box sx={{ mt: { xs: 3.5, md: 4 } }}>
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mb: { xs: 2, md: 2.5 } }} />

            {article.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
                {article.tags.map((tag) => (
                  <Chip key={tag.id} label={tag.name} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <StatItem icon={<Eye size={14} />}>
                {article.views} views
              </StatItem>
              {article.likeCount > 0 && (
                <StatItem icon={<Heart size={14} />}>
                  {article.likeCount}
                </StatItem>
              )}
              {article.commentCount > 0 && (
                <StatItem icon={<MessageSquare size={14} />}>
                  {article.commentCount}
                </StatItem>
              )}
              {article.bookmarkCount > 0 && (
                <StatItem icon={<Bookmark size={14} />}>
                  {article.bookmarkCount}
                </StatItem>
              )}
              {article.challengeCount > 0 && (
                <StatItem icon={<MessageSquare size={14} />}>
                  {article.challengeCount} challenges
                </StatItem>
              )}
              <StatItem icon={<Zap size={14} />}>
                Pulse {article.pulseScore}
              </StatItem>
            </Box>
          </Box>
        </Box>

        {/* ── Sidebar (desktop – sticky) ── */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            position: 'sticky',
            top: 88,
          }}
        >
          {sidebarContent}
        </Box>
      </Box>

      {/* ── Sidebar (mobile / tablet) ── */}
      <Box sx={{ display: { xs: 'block', lg: 'none' }, mt: { xs: 4, md: 5 } }}>
        {sidebarContent}
      </Box>
    </PageContainer>
  );
};

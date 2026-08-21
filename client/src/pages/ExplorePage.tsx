import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Pagination, Stack } from '@mui/material';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer';
import { Kicker } from '../components/common/Kicker';
import { ArticleList } from '../features/articles/ArticleList';
import { CategoryFilter } from '../features/articles/CategoryFilter';
import { useArticleList, useCategories } from '../features/articles/hooks';

const sortTabs = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'pulse', label: 'Pulse' },
] as const;

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentCategory = searchParams.get('category') || null;
  const currentSearch = searchParams.get('search') || '';
  const currentSort = (searchParams.get('sort') as 'latest' | 'popular' | 'pulse') || 'latest';

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data, isLoading, isError, error, refetch } = useArticleList({
    page: currentPage,
    limit: 12,
    sort: currentSort,
    category: currentCategory || undefined,
    search: currentSearch || undefined,
  });

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    if (updates.category !== undefined || updates.search !== undefined) {
      next.set('page', '1');
    }
    setSearchParams(next, { replace: true });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim() || null });
  };

  const total = data?.pagination.total;
  const sortLabel = sortTabs.find((tab) => tab.value === currentSort)?.label ?? 'Latest';

  return (
    <PageContainer>
      {/* Editorial header */}
      <Box sx={{ pt: { xs: 4, md: 6 }, pb: { xs: 3, md: 4 }, maxWidth: 760 }}>
        <Kicker color="accent" sx={{ mb: 2 }}>
          The Archive
        </Kicker>
        <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
          Explore
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 560, fontSize: { xs: '1rem', md: '1.125rem' } }}
        >
          Every story, topic, and argument in one place — search the archive,
          filter by subject, and sort by what matters.
        </Typography>
      </Box>

      {/* Archive toolbar */}
      <Box
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          pt: { xs: 3.5, md: 4 },
          pb: { xs: 4, md: 5 },
        }}
      >
        {/* Search + result context */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1.5, sm: 3 },
            mb: { xs: 3.5, md: 4 },
          }}
        >
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ flex: 1 }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search stories, topics, arguments…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: 'text.muted' }}>
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInput-input': { py: 1.25, fontSize: '1rem' },
                '& .MuiInput-underline:before': { borderBottomColor: 'divider' },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  borderBottomColor: 'text.muted',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: 'secondary.main',
                },
              }}
            />
          </Box>

          {!isLoading && total != null && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: { xs: 'normal', sm: 'nowrap' }, flexShrink: 0 }}
            >
              <Typography component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {total} {total === 1 ? 'story' : 'stories'}
              </Typography>
              {currentSearch && (
                <>
                  {' · '}
                  <Box component="span" sx={{ color: 'secondary.dark' }}>
                    “{currentSearch}”
                  </Box>
                </>
              )}
              {' · '}
              {sortLabel}
            </Typography>
          )}
        </Box>

        {/* Category filters */}
        <CategoryFilter
          categories={categories}
          isLoading={categoriesLoading}
          selectedSlug={currentCategory}
          onSelect={(slug) => updateParams({ category: slug })}
        />

        {/* Sort tabs */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 2.5, md: 3.5 },
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          {sortTabs.map((tab) => {
            const active = currentSort === tab.value;
            return (
              <Box
                key={tab.value}
                component="button"
                type="button"
                aria-pressed={active}
                onClick={() => updateParams({ sort: tab.value })}
                sx={{
                  appearance: 'none',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.9375rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'text.primary' : 'text.secondary',
                  pb: 1.25,
                  mb: '-1px',
                  borderBottom: '2px solid',
                  borderColor: active ? 'secondary.main' : 'transparent',
                  transition: 'color 160ms ease, border-color 160ms ease',
                  '&:hover': {
                    color: 'text.primary',
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineColor: 'secondary.main',
                    outlineOffset: 3,
                  },
                }}
              >
                {tab.label}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Results */}
      <ArticleList
        articles={data?.articles}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        emptyTitle="No articles found"
        emptyMessage={
          currentSearch
            ? `No results for "${currentSearch}". Try a different search.`
            : 'Check back later for new content.'
        }
      />

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <Box
          sx={{
            mt: { xs: 5, md: 6 },
            pt: { xs: 3.5, md: 4 },
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack alignItems="center">
            <Pagination
              count={data.pagination.totalPages}
              page={currentPage}
              onChange={(_event, page) => updateParams({ page: String(page) })}
              color="primary"
              shape="rounded"
              size="medium"
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5 }}>
              Showing{' '}
              {(currentPage - 1) * 12 + 1}–{Math.min(currentPage * 12, data.pagination.total)} of{' '}
              {data.pagination.total} articles
            </Typography>
          </Stack>
        </Box>
      )}
    </PageContainer>
  );
};

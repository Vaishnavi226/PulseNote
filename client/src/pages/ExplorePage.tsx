import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Pagination, Stack } from '@mui/material';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer';
import { ArticleList } from '../features/articles/ArticleList';
import { CategoryFilter } from '../features/articles/CategoryFilter';
import { useArticleList, useCategories } from '../features/articles/hooks';

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

  return (
    <PageContainer>
      <Typography variant="h2" sx={{ mb: 2 }}>
        Explore
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Search stories, topics, and technical arguments.
      </Typography>

      {/* Search */}
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 4, maxWidth: 480 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search articles..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#8A9096" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'background.paper',
            },
          }}
        />
      </Box>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        isLoading={categoriesLoading}
        selectedSlug={currentCategory}
        onSelect={(slug) => updateParams({ category: slug })}
      />

      {/* Sort Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
        {(['latest', 'popular', 'pulse'] as const).map((sort) => (
          <Box
            key={sort}
            onClick={() => updateParams({ sort })}
            sx={{
              px: 2,
              py: 1,
              borderRadius: '10px',
              border: '1px solid',
              borderColor: currentSort === sort ? 'primary.main' : 'divider',
              backgroundColor: currentSort === sort ? 'primary.main' : 'transparent',
              color: currentSort === sort ? '#fff' : 'text.secondary',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 180ms ease',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: currentSort === sort ? 'primary.main' : 'action.hover',
              },
            }}
          >
            {sort === 'latest' ? 'Latest' : sort === 'popular' ? 'Popular' : 'Pulse'}
          </Box>
        ))}
      </Box>

      {/* Article List */}
      <ArticleList
        articles={data?.articles}
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        emptyTitle="No articles found"
        emptyMessage={currentSearch ? `No results for "${currentSearch}". Try a different search.` : 'Check back later for new content.'}
      />

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 5 }}>
          <Pagination
            count={data.pagination.totalPages}
            page={currentPage}
            onChange={(_event, page) => updateParams({ page: String(page) })}
            color="primary"
            shape="rounded"
            size="medium"
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1.5 }}>
            Showing {((currentPage - 1) * 12) + 1}–{Math.min(currentPage * 12, data.pagination.total)} of {data.pagination.total} articles
          </Typography>
        </Stack>
      )}
    </PageContainer>
  );
};

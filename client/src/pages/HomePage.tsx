import React from 'react';
import { Box, Typography, Button, Chip, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight, MessageSquare, Zap } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { ArticleList } from '../features/articles/ArticleList';
import { useArticleList } from '../features/articles/hooks';

export const HomePage: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useArticleList({
    sort: 'latest',
    limit: 6,
  });

  return (
    <PageContainer>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          maxWidth: 900,
        }}
      >
        <Chip
          icon={<Zap size={14} color="#5C78B8" />}
          label="TECHNOLOGY • IDEAS • DEBATE"
          size="small"
          sx={{
            mb: 3,
            backgroundColor: 'secondary.light',
            color: 'secondary.dark',
            fontWeight: 700,
            fontSize: '0.75rem',
            letterSpacing: '0.05em',
          }}
        />

        <Typography variant="h1" component="h1" sx={{ mb: 3 }}>
          Ideas worth reading. Opinions worth challenging.
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 640, fontSize: '1.2rem' }}>
          PulseNote is where technology stories become structured conversations. Read long-form editorial insights and challenge weak assumptions.
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={RouterLink}
            to="/explore"
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowRight size={18} />}
          >
            Explore Stories
          </Button>

          <Button
            component={RouterLink}
            to="/challenges"
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<MessageSquare size={18} />}
          >
            Join Discussions
          </Button>
        </Box>
      </Box>

      {/* Latest Articles */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h2">
            Latest Stories
          </Typography>
          <Link
            component={RouterLink}
            to="/explore"
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
              color: 'primary.main',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            View all
          </Link>
        </Box>

        <ArticleList
          articles={data?.articles}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          emptyTitle="No stories yet"
          emptyMessage="Articles will appear here as they are published."
          variant="standard"
        />
      </Box>
    </PageContainer>
  );
};

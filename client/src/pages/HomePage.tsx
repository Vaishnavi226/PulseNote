import React from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight, MessageSquare, Zap } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';

export const HomePage: React.FC = () => {
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

      {/* Hero Editorial Preview Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: '28px',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          mt: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Chip label="AI & DEVELOPMENT" size="small" variant="outlined" />
          <Typography variant="caption" color="text.secondary">
            8 min read • 24 Challenges
          </Typography>
        </Box>

        <Typography variant="h3" sx={{ mb: 2 }}>
          AI Coding Agents Are Changing What Junior Developers Actually Do
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          A practical look at what AI changes, what it does not, and why software engineering judgment matters more than syntax generation.
        </Typography>

        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'secondary.main', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
            QUICK TAKE
          </Typography>
          <Typography variant="body2" color="text.primary">
            • AI is automating repetitive boilerplates<br />
            • Entry-level roles are shifting toward architecture and testing<br />
            • Product thinking and domain modeling remain human priorities
          </Typography>
        </Box>
      </Paper>
    </PageContainer>
  );
};

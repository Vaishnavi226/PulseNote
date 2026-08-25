import React from 'react';
import { Box, Typography, Container, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Twitter, Linkedin, Github, Youtube, Sparkles } from 'lucide-react';
import { Navbar } from './Navbar';

interface AppShellProps {
  children: React.ReactNode;
}

const footerColumns = [
  {
    heading: 'News',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Explore', to: '/explore' },
      { label: 'Trending', to: '/trending' },
      { label: 'Challenges', to: '/challenges' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us', to: '/' },
      { label: 'Contact Us', to: '/' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Use', to: '/' },
    ],
  },
  {
    heading: 'Contribute',
    links: [
      { label: 'Write for Us', to: '/write' },
    ],
  },
];

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          mt: 'auto',
          borderTop: '1px solid #E5E5E5',
          backgroundColor: 'background.paper',
          py: { xs: 4, md: 5 },
        }}
      >
        <Container
          maxWidth={false}
          sx={{ px: { xs: '16px', sm: '24px', md: '64px' }, maxWidth: '1400px !important', mx: 'auto' }}
        >
          {/* Main Footer Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr 1fr 1fr' },
              gap: { xs: 4, md: 6 },
              alignItems: 'start',
            }}
          >
            {/* Brand Column */}
            <Box sx={{ maxWidth: 300 }}>
              <Box
                component={RouterLink}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  textDecoration: 'none',
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                <Sparkles size={20} color="#050505" />
                <Typography
                  sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    letterSpacing: '-0.03em',
                    color: '#0B1020',
                  }}
                >
                  PulseNote
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: '#777',
                  fontSize: '11px',
                  fontWeight: 500,
                  mb: 1.5,
                }}
              >
                Read. Think. Challenge.
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#5F6470', fontSize: '12px', lineHeight: 1.5, mb: 2 }}
              >
                PulseNote is a technology &amp; digital culture publication exploring ideas, systems and stories shaping our digital world.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, color: '#0B1020' }}>
                <IconButton size="small" component="a" href="#" sx={{ p: 0.5, color: 'inherit' }}>
                  <Twitter size={15} />
                </IconButton>
                <IconButton size="small" component="a" href="#" sx={{ p: 0.5, color: 'inherit' }}>
                  <Linkedin size={15} />
                </IconButton>
                <IconButton size="small" component="a" href="#" sx={{ p: 0.5, color: 'inherit' }}>
                  <Github size={15} />
                </IconButton>
                <IconButton size="small" component="a" href="#" sx={{ p: 0.5, color: 'inherit' }}>
                  <Youtube size={15} />
                </IconButton>
              </Box>
            </Box>

            {/* Link Columns */}
            {footerColumns.map((col) => (
              <Box key={col.heading}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#0B1020',
                    mb: 1.5,
                  }}
                >
                  {col.heading}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {col.links.map((link) => (
                    <Typography
                      key={link.label}
                      component={RouterLink}
                      to={link.to}
                      sx={{
                        fontSize: '12px',
                        color: '#5F6470',
                        textDecoration: 'none',
                        transition: 'color 160ms ease',
                        '&:hover': { color: '#0B1020' },
                      }}
                    >
                      {link.label}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Bottom Copyright */}
          <Box
            sx={{
              mt: { xs: 4, md: 5 },
              pt: 2.5,
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: '11px', color: '#777' }}>
              &copy; {new Date().getFullYear()} PulseNote. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};


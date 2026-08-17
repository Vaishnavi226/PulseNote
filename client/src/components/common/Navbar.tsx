import React from 'react';
import { Box, Typography, Button, IconButton, Container } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { usePulseTheme } from '../../theme/ThemeProvider';

export const Navbar: React.FC = () => {
  const { mode, toggleTheme } = usePulseTheme();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'Trending', path: '/trending' },
    { label: 'Challenges', path: '/challenges' },
  ];

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        height: 76,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: mode === 'light' ? 'rgba(247, 247, 244, 0.85)' : 'rgba(13, 14, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'text.primary',
            }}
          >
            <Sparkles size={24} color={mode === 'light' ? '#5C78B8' : '#728ECB'} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.03em',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              PulseNote
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Typography
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    textDecoration: 'none',
                    position: 'relative',
                    transition: 'color 180ms ease',
                    '&:hover': {
                      color: 'primary.main',
                    },
                    '&::after': isActive
                      ? {
                          content: '""',
                          position: 'absolute',
                          bottom: -6,
                          left: 0,
                          right: 0,
                          height: 2,
                          backgroundColor: 'secondary.main',
                          borderRadius: 1,
                        }
                      : {},
                  }}
                >
                  {item.label}
                </Typography>
              );
            })}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
              {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </IconButton>

            <Button
              component={RouterLink}
              to="/write"
              variant="contained"
              color="primary"
              size="small"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Write Note
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

import React from 'react';
import { Box, Typography, Button, IconButton, Container, Avatar, Menu, MenuItem } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Sparkles, Search } from 'lucide-react';
import { usePulseTheme } from '../../theme/ThemeProvider';
import { useAuth } from '../../features/auth/useAuth';

export const Navbar: React.FC = () => {
  const { mode, toggleTheme } = usePulseTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'Trending', path: '/trending' },
    { label: 'Challenges', path: '/challenges' },
    { label: 'Write', path: '/write' },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/', { replace: true });
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: mode === 'light' ? '#FFFFFF' : '#121417',
        borderBottom: '1px solid',
        borderColor: mode === 'light' ? '#E8E8E8' : 'divider',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 8 }, maxWidth: 1400 }}>
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
            <Sparkles size={22} color={mode === 'light' ? '#050505' : '#728ECB'} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '-0.03em',
                fontFamily: "'DM Sans', sans-serif",
                color: mode === 'light' ? '#101525' : '#FFFFFF',
              }}
            >
              PulseNote
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3.5, alignItems: 'center' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Typography
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive
                      ? (mode === 'light' ? '#101525' : '#FFFFFF')
                      : (mode === 'light' ? '#4A5060' : 'text.secondary'),
                    textDecoration: 'none',
                    transition: 'color 160ms ease',
                    '&:hover': {
                      color: mode === 'light' ? '#101525' : '#FFFFFF',
                    },
                  }}
                >
                  {item.label}
                </Typography>
              );
            })}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              component={RouterLink}
              to="/explore"
              size="small"
              sx={{ color: mode === 'light' ? '#101525' : 'text.secondary' }}
              aria-label="Search articles"
            >
              <Search size={18} />
            </IconButton>

            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{ color: mode === 'light' ? '#101525' : 'text.secondary' }}
              aria-label="Toggle theme"
            >
              {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </IconButton>

            {isAuthenticated && user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={handleMenuOpen} size="small">
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: '#050505',
                      color: '#fff',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  slotProps={{
                    paper: {
                      sx: { mt: 1, minWidth: 160 },
                    },
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {user.name}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography variant="body2">Sign Out</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                sx={{
                  backgroundColor: mode === 'light' ? '#050505' : '#FFFFFF',
                  color: mode === 'light' ? '#FFFFFF' : '#050505',
                  borderRadius: '5px',
                  padding: '7px 16px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: mode === 'light' ? '#222222' : '#E0E0E0',
                    boxShadow: 'none',
                  },
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};


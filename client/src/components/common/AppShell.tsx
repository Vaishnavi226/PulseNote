import React from 'react';
import { Box, Typography, Container, Divider } from '@mui/material';
import { Navbar } from './Navbar';

interface AppShellProps {
  children: React.ReactNode;
}

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

      <Box component="footer" sx={{ mt: 'auto', backgroundColor: 'background.paper' }}>
        <Divider />
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 6 }, py: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'flex-end' },
              gap: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  fontSize: '1.25rem',
                  lineHeight: 1.2,
                  color: 'text.primary',
                }}
              >
                PulseNote
              </Typography>
              <Typography variant="caption" color="text.muted" sx={{ display: 'block', mt: 0.75 }}>
                Editorial publishing &amp; structured discussion
              </Typography>
            </Box>
            <Typography variant="caption" color="text.muted">
              © {new Date().getFullYear()} PulseNote · Read. Think. Challenge.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

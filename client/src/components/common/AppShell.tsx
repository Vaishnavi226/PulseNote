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

      <Box component="footer" sx={{ py: 6, mt: 'auto', backgroundColor: 'background.paper' }}>
        <Divider sx={{ mb: 4 }} />
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} PulseNote. Read. Think. Challenge.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Editorial publishing & structured discussion platform
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

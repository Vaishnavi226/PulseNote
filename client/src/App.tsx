import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PulseThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './features/auth/AuthContext';
import { AppRoutes } from './pages/AppRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PulseThemeProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </PulseThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

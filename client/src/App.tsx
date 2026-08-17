import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PulseThemeProvider } from './theme/ThemeProvider';
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
      <PulseThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PulseThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

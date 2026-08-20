import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '../components/common/AppShell';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { HomePage } from './HomePage';
import { ExplorePage } from './ExplorePage';
import { TrendingPage } from './TrendingPage';
import { ChallengesPage } from './ChallengesPage';
import { ArticleDetailPage } from './ArticleDetailPage';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { NotFoundPage } from './NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <AppShell>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/article/:slug" element={<ArticleDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/write"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
};

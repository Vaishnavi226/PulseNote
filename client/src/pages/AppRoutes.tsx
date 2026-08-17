import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from '../components/common/AppShell';
import { HomePage } from './HomePage';
import { ExplorePage } from './ExplorePage';
import { TrendingPage } from './TrendingPage';
import { ChallengesPage } from './ChallengesPage';
import { NotFoundPage } from './NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
};

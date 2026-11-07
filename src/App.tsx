import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { PricingPage } from './pages/PricingPage';
import { DashboardHomePage } from './pages/DashboardHomePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { FollowingPage } from './pages/FollowingPage';
import { ConceptsPage } from './pages/ConceptsPage';
import { VideosPage } from './pages/VideosPage';
import { FormatsPage } from './pages/FormatsPage';
import { CoinsPage } from './pages/CoinsPage';
import { AffiliatePage } from './pages/AffiliatePage';
import { SettingsPage } from './pages/SettingsPage';
import { LegalPage } from './pages/LegalPage';

// Route Guard for authenticated & planned users
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiresPlan?: boolean }> = ({
  children,
  requiresPlan = true
}) => {
  const { user, hasActivePlanOrTrial } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/auth?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }

  if (requiresPlan && !hasActivePlanOrTrial) {
    return (
      <Navigate
        to={`/pricing?msg=${encodeURIComponent("Pick a plan or start the free trial. You need a plan or the 7-day trial before the dashboard opens.")}`}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<LegalPage />} />
          <Route path="/terms" element={<LegalPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/following"
            element={
              <ProtectedRoute>
                <FollowingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/concepts"
            element={
              <ProtectedRoute>
                <ConceptsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/videos"
            element={
              <ProtectedRoute>
                <VideosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/formats"
            element={
              <ProtectedRoute>
                <FormatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coins"
            element={
              <ProtectedRoute>
                <CoinsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/affiliate"
            element={
              <ProtectedRoute>
                <AffiliatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

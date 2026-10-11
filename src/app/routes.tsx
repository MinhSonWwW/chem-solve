import React, { lazy } from 'react';
import { createHashRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { RouteErrorBoundary } from './ErrorBoundary';

const AuthPage = lazy(() => import('@/features/auth/AuthPage').then(m => ({ default: m.AuthPage })));

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LearnPage = lazy(() => import('./pages/LearnPage').then(m => ({ default: m.LearnPage })));
const PracticePage = lazy(() => import('./pages/PracticePage').then(m => ({ default: m.PracticePage })));
const ExercisePage = lazy(() => import('./pages/ExercisePage').then(m => ({ default: m.ExercisePage })));
const TheoryPage = lazy(() => import('./pages/TheoryPage').then(m => ({ default: m.TheoryPage })));
const DailyPage = lazy(() => import('./pages/DailyPage').then(m => ({ default: m.DailyPage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));
const ShopPage = lazy(() => import('./pages/ShopPage').then(m => ({ default: m.ShopPage })));
const GamesPage = lazy(() => import('./pages/GamesPage').then(m => ({ default: m.GamesPage })));
const LabPage = lazy(() => import('@/features/lab/LabPage').then(m => ({ default: m.LabPage })));
const DesignSystemPage = lazy(() => import('./pages/DesignSystemPage').then(m => ({ default: m.DesignSystemPage })));

const LearnRedirect: React.FC = () => {
  const grade = typeof window !== 'undefined' ? localStorage.getItem('chem_active_grade') || '8' : '8';
  return <Navigate to={`/learn/${grade}`} replace />;
};

export const router = createHashRouter([
  {
    path: '/auth',
    element: (
      <React.Suspense fallback={<div className="min-h-[100dvh] bg-[#131f24]" />}>
        <AuthPage />
      </React.Suspense>
    ),
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <LearnRedirect />
      },
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: 'learn',
        element: <LearnRedirect />
      },
      {
        path: 'learn/:grade',
        element: <LearnPage />
      },
      {
        path: 'practice',
        element: <PracticePage />
      },
      {
        path: 'practice/:gameId',
        element: <Navigate to="/practice" replace />
      },
      {
        path: 'play/:lessonId/:nodeId',
        element: <ExercisePage />
      },
      {
        path: 'theory/:lessonId/:nodeId',
        element: <TheoryPage />
      },
      {
        path: 'games',
        element: <Navigate to="/practice" replace />
      },
      {
        path: 'games/:gameId',
        element: <GamesPage />
      },
      {
        path: 'daily',
        element: <DailyPage />
      },
      {
        path: 'progress',
        element: <ProgressPage />
      },
      {
        path: 'profile',
        element: <ProfilePage />
      },
      {
        path: 'search',
        element: <SearchPage />
      },
      {
        path: 'shop',
        element: <ShopPage />
      },
      {
        path: 'lab',
        element: <LabPage />
      },
      {
        path: 'dev/design-system',
        element: <DesignSystemPage />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
]);

import { createHashRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { RouteErrorBoundary } from './ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { LearnPage } from './pages/LearnPage';
import { PracticePage } from './pages/PracticePage';
import { ExercisePage } from './pages/ExercisePage';
import { GamesPage } from './pages/GamesPage';
import { DailyPage } from './pages/DailyPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { ShopPage } from './pages/ShopPage';
import { DesignSystemPage } from './pages/DesignSystemPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/learn/8" replace />
      },
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: 'learn',
        element: <Navigate to="/learn/8" replace />
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
        path: 'play/:lessonId/:nodeId',
        element: <ExercisePage />
      },
      {
        path: 'games',
        element: <GamesPage />
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

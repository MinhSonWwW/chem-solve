import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import '@/lib/theme';
import { useUserStore } from '@/features/gamification/useUserStore';

export const App: React.FC = () => {
  useEffect(() => {
    // Self-heal and hydrate user progress across IndexedDB, LocalStorage and Cookies
    useUserStore.getState().restoreProgress().catch(console.error);
  }, []);

  return <RouterProvider router={router} />;
};

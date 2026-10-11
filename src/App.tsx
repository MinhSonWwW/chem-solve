import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import '@/lib/theme';

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

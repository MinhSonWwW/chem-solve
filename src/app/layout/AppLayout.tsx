import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopRightSidebar } from './DesktopRightSidebar';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const isExerciseMode = location.pathname.startsWith('/play');

  // Distraction-free exercise mode
  if (isExerciseMode) {
    return (
      <div className="min-h-[100dvh] bg-[#131f24] text-slate-100 flex flex-col justify-between">
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4">
          <Outlet />
        </main>
      </div>
    );
  }

  // Standard 3-column Duolingo layout for desktop + responsive mobile layout
  return (
    <div className="min-h-[100dvh] bg-[#131f24] text-slate-100 flex flex-col">
      {/* Mobile Top Header */}
      <TopHeader />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-[1360px] mx-auto flex justify-center">
        {/* Left Column: Fixed Desktop Navigation Sidebar */}
        <DesktopSidebar />

        {/* Middle Column: Learning Path / Active Page Content */}
        <main className="flex-1 max-w-[640px] w-full px-4 pt-4 pb-24 lg:pb-12 lg:px-6">
          <Outlet />
        </main>

        {/* Right Column: Motivation Widgets (Quests, League, Streak) */}
        <DesktopRightSidebar />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

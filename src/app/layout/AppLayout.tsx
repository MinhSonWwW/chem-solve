import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopRightSidebar } from './DesktopRightSidebar';

export const PageLoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] py-16 text-center select-none animate-pulse">
    <div className="w-16 h-16 rounded-2xl bg-[#1e2e38] border-2 border-[#2e4756] flex items-center justify-center text-3xl mb-3 shadow-lg animate-bounce">
      🧪
    </div>
    <div className="text-sm font-black text-slate-200">Đang chuẩn bị thí nghiệm...</div>
    <div className="text-xs text-slate-400 mt-1">Phòng lab đang nạp tài nguyên bài học</div>
  </div>
);

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const isExerciseMode = location.pathname.startsWith('/play');
  const isLabMode = location.pathname.startsWith('/lab');

  // Distraction-free exercise mode
  if (isExerciseMode) {
    return (
      <div className="min-h-[100dvh] bg-[#131f24] text-slate-100 flex flex-col justify-between">
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4">
          <Suspense fallback={<PageLoadingFallback />}>
            <Outlet />
          </Suspense>
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
        <main
          className={`flex-1 w-full px-4 pt-4 pb-24 lg:pb-12 lg:px-6 ${
            isLabMode ? 'max-w-5xl' : 'max-w-[640px]'
          }`}
        >
          <Suspense fallback={<PageLoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>

        {/* Right Column: Motivation Widgets (Quests, League, Streak) */}
        {!isLabMode && <DesktopRightSidebar />}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

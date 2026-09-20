import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const isExerciseMode = location.pathname.startsWith('/play');

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col justify-between">
      {!isExerciseMode && <TopHeader />}

      <main className={`flex-1 max-w-md w-full mx-auto px-4 ${isExerciseMode ? 'py-4' : 'pt-4 pb-24'}`}>
        <Outlet />
      </main>

      {!isExerciseMode && (
        <div className="max-w-md mx-auto w-full px-4 mb-20 text-center">
          <Link
            to="/dev/design-system"
            className="inline-block text-[11px] text-slate-500 hover:text-cyan-400 bg-slate-900 border border-slate-800/80 px-2.5 py-1 rounded-full transition-colors"
          >
            🛠️ Dev: Design System Gallery
          </Link>
        </div>
      )}

      {!isExerciseMode && <BottomNav />}
    </div>
  );
};

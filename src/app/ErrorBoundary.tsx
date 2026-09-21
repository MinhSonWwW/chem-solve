import React from 'react';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { Mascot, Button } from '@/design-system';

export const RouteErrorBoundary: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'Đã có lỗi bất ngờ xảy ra trong quá trình xử lý.';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || `${error.status} - Không tìm thấy trang`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-md border-2 border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <div className="mb-4">
          <Mascot state="wrong" size="xl" />
        </div>

        <h1 className="text-xl md:text-2xl font-black text-white mb-2">
          Phản ứng không mong muốn! 🧪💥
        </h1>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Phòng thí nghiệm vừa gặp sự cố nhỏ. Đừng lo, dữ liệu tiến độ của bạn vẫn an toàn!
        </p>

        {errorMessage && (
          <div className="w-full mb-6 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-xs font-mono text-rose-300 text-left overflow-x-auto max-h-32">
            {errorMessage}
          </div>
        )}

        <div className="w-full flex flex-col gap-3">
          <Button
            variant="primary"
            fullWidth
            onClick={() => window.location.reload()}
          >
            🔄 Thử tải lại trang
          </Button>

          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/learn')}
          >
            🗺️ Về lộ trình học tập
          </Button>
        </div>
      </div>
    </div>
  );
};

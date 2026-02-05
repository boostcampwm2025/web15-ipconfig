import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/common/components/shadcn/button';
import { useErrorPage } from '@/common/hooks/useErrorPage';

function ErrorPage() {
  const { title, message, status, handleGoHome, handleGoBack } = useErrorPage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-slate-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_#22c55e1f,_transparent_60%),radial-gradient(circle_at_bottom,_#3b82f61f,_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/40">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              ERROR
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50">
              {title}
            </h1>
          </div>
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-line text-slate-300">
          {message}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={handleGoHome}
            className="hover:bg-green-400 focus-visible:ring-2 focus-visible:ring-green-400/80 focus-visible:outline-none"
          >
            <Home className="h-4 w-4" />
            홈으로 돌아가기
          </Button>
          <Button
            type="button"
            onClick={handleGoBack}
            variant="outline"
            className="hover:border-slate-500 hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-500/80 focus-visible:outline-none"
          >
            <ArrowLeft className="h-4 w-4" />
            이전 화면으로
          </Button>
        </div>
        {status ? (
          <p className="mt-4 text-xs text-slate-500">
            오류 코드: <span className="font-mono">{status}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default ErrorPage;

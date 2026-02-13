import { Spinner } from '@/common/components/shadcn/spinner';

export function LoadingSpinner() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Spinner className="mb-5 size-10" />
      <p className="text-muted-foreground text-sm">워크스페이스 입장 중...</p>
    </div>
  );
}

import { Spinner } from '@/common/components/shadcn/spinner';

export function LoadingSpinner() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Spinner className="size-10" />
      <p className="text-muted-foreground text-sm">
        워크스페이스에 입장하는 중입니다...
      </p>
    </div>
  );
}

import { Button } from '@/common/components/shadcn/button';
import { useJoinWorkspace } from '@/common/hooks/useJoinWorkspace';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

function JoinBadge() {
  const { register, handleSubmit, onSubmit, errors } = useJoinWorkspace();

  return (
    <div className="mb-4 flex w-1/3 min-w-fit items-center gap-2 rounded-full border bg-gray-200/40 px-4 py-1 text-xs font-medium dark:bg-gray-800/40">
      <span className="relative flex size-2">
        <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
        <span className="bg-primary relative inline-flex size-2 rounded-full"></span>
      </span>
      <span>받은 초대코드가 있나요?</span>
      <input
        placeholder="코드 입력 (예: 1a2b3c)"
        {...register('code', { required: true })}
        maxLength={32}
        className="placeholder:text-foreground/50 h-7 w-35 rounded-lg border border-gray-300 px-2 outline-none dark:border-gray-700"
      />
      <Button
        variant="link"
        size="sm"
        className="!p-0 text-xs font-bold"
        onClick={() => {
          if (errors.code?.message) {
            toast.error(errors.code?.message);
            return;
          }
          handleSubmit(onSubmit)();
        }}
      >
        입장하기
        <ArrowRight className="size-3 p-0" />
      </Button>
    </div>
  );
}

export default JoinBadge;

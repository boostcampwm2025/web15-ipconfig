import { useClipboard } from '@/common/hooks/useClipboard';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/common/components/shadcn/dialog';
import { Button } from '@/common/components/shadcn/button';
import { LuFileText, LuCheck, LuCopy, LuCircleX } from 'react-icons/lu';
import { SpinnerCustom } from '@/common/components/SpinnerCustom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ExportDocDialog({
  markdown,
  isLoading,
  error,
}: {
  markdown: string;
  isLoading: boolean;
  error: string | null;
}) {
  const { isCopied, handleCopyToClipboard } = useClipboard();

  return (
    <DialogContent className="z-999 sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <LuFileText size={18} className="text-primary-600" />
          마크다운으로 내보내기
        </DialogTitle>
        <DialogDescription>
          협의한 그라운드 룰 및 컨벤션을 마크다운으로 내보낼 수 있습니다.
          <br />
          GitHub 위키나 README에 바로 붙여넣으세요.
        </DialogDescription>
      </DialogHeader>
      <div className="flex h-[45vh] items-center justify-center overflow-y-auto rounded-lg bg-[#0C1117] px-4 py-3">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <SpinnerCustom />
            <span>불러오는 중...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2">
            <LuCircleX size={16} className="text-red-500" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="markdown-body h-full w-full">
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button
          variant="secondary"
          onClick={() => handleCopyToClipboard(markdown)}
        >
          {isCopied ? (
            <LuCheck size={16} className="text-green-500" />
          ) : (
            <LuCopy size={16} />
          )}
          {isCopied ? '복사 완료!' : '복사 하기'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

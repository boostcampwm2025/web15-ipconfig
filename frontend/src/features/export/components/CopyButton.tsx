import { Button } from '@/common/components/shadcn/button';
import { LuCheck, LuCopy } from 'react-icons/lu';
import { useClipboard } from '@/common/hooks/useClipboard';

export function CopyButton({ content }: { content: string }) {
  const { isCopied, handleCopyToClipboard } = useClipboard();
  return (
    <Button
      variant="secondary"
      onClick={() => handleCopyToClipboard(content)}
      className="gap-2"
    >
      {isCopied ? (
        <LuCheck size={16} className="text-green-500" />
      ) : (
        <LuCopy size={16} />
      )}
      {isCopied ? '복사 완료!' : '복사 하기'}
    </Button>
  );
}

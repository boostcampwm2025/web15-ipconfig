import { Button } from '@/common/components/shadcn/button';
import { useClipboard } from '@/common/hooks/useClipboard';
import { LuCheck, LuShare2 } from 'react-icons/lu';

function InviteButton() {
  const { isCopied, handleCopyToClipboard } = useClipboard();

  return (
    <Button
      size="sm"
      className="shadow-primary-500/20 font-semibold shadow-md"
      onClick={() => handleCopyToClipboard(window.location.href)}
    >
      {isCopied ? <LuCheck size={16} /> : <LuShare2 size={16} />}
      {isCopied ? '복사 완료!' : '공유 하기'}
    </Button>
  );
}

export default InviteButton;

import { Button } from '@/common/components/shadcn/button';
import { LuShare2 } from 'react-icons/lu';
import { useToast } from '@/common/hooks/useToast';
import { Toast } from '@/common/components/Toast';

export const InviteButton = () => {
  const { isVisible, message, showToast } = useToast();

  const handleInvite = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast('링크 복사됨');
    } catch (err) {
      showToast('복사 실패');
    }
  };

  return (
    <>
      <Button
        onClick={handleInvite}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-green-500 py-1"
      >
        <LuShare2 />
        <span className="flex h-8 items-center text-sm font-semibold">
          초대하기
        </span>
      </Button>
      <Toast message={message} isVisible={isVisible} />
    </>
  );
};

import { Button } from '@/common/components/shadcn/button';
import { LuShare2 } from 'react-icons/lu';

export const InviteButton = () => {
  return (
    <Button
      onClick={() => {}}
      className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-green-500 py-1"
    >
      <LuShare2 />
      <span className="flex h-8 items-center text-sm font-semibold">
        초대하기
      </span>
    </Button>
  );
};

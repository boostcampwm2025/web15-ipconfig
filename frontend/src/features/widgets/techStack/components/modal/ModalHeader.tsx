import { Button } from '@/common/components/shadcn/button';
import { LuX } from 'react-icons/lu';
import type { ComponentProps } from 'react';

interface HeaderProps {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
}

export default function ModalHeader({
  title,
  icon,
  onClose,
  ...props
}: HeaderProps & ComponentProps<'header'>) {
  return (
    <header
      className="flex cursor-move items-center justify-between px-6 pt-3 pb-1 select-none"
      {...props}
    >
      <div className="flex items-center gap-3 text-[17px] font-bold text-white">
        {icon} {title}
      </div>
      <Button
        variant="ghost"
        onClick={onClose}
        className="cursor-pointer !p-0 text-gray-500"
      >
        <LuX className="size-5" />
      </Button>
    </header>
  );
}

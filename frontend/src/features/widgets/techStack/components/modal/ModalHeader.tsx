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
      className="flex cursor-move items-center justify-between border-b border-gray-700 px-4 py-1 select-none"
      {...props}
    >
      <div className="flex items-center gap-2 text-sm font-bold text-white">
        {icon} {title}
      </div>
      <Button
        variant="ghost"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onClose}
        className="hover:text-main shrink-0 text-gray-500 transition-colors hover:cursor-pointer hover:bg-transparent dark:hover:bg-transparent"
      >
        <LuX size={16} />
      </Button>
    </header>
  );
}

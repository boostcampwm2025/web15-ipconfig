import { ArrowRight } from 'lucide-react';
import { Button } from '@/common/components/shadcn/button';
import { cn } from '@/common/lib/utils';

interface MainButtonProps {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const MainButton = ({ text, icon, onClick, className }: MainButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'group relative transform rounded-lg px-8 py-4 font-mono font-bold transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        <span className="text-lg">{text}</span>
        <ArrowRight
          size={18}
          className="transition-transform group-hover:translate-x-1"
        />
      </span>
    </Button>
  );
};

export default MainButton;

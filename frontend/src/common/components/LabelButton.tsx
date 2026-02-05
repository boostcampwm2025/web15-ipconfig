import { Button } from '@/common/components/shadcn/button';
import { cn } from '@/common/lib/utils';
import { LuCheck } from 'react-icons/lu';

interface LabelButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export default function LabelButton({
  label,
  isSelected,
  onClick,
  className,
}: LabelButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'flex justify-start gap-2 border p-2 text-left text-sm transition-all',
        'hover:bg-accent hover:text-accent-foreground',
        isSelected
          ? 'border-primary bg-primary/5 text-primary ring-primary/20 ring-1'
          : 'border-muted bg-card text-muted-foreground',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded border transition-colors',
          isSelected
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-muted-foreground/30',
        )}
      >
        {isSelected && <LuCheck size={10} />}
      </div>
      <span>{label}</span>
    </Button>
  );
}

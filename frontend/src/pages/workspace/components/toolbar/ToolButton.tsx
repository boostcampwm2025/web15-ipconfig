import { Button } from '@/common/components/shadcn/button';

interface ToolButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

function ToolButton({
  icon,
  label,
  onClick,
  active,
  disabled,
}: ToolButtonProps) {
  return (
    <div className="group relative flex items-center justify-center">
      <Button
        variant="ghost"
        onClick={onClick}
        disabled={disabled}
        className={`h-9 w-9 transition-all [&_svg]:size-5 ${
          active
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {icon}
      </Button>
      {label && (
        <span className="border-border bg-popover text-popover-foreground pointer-events-none absolute left-14 z-50 rounded border px-2 py-1 text-xs whitespace-nowrap opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {label}
        </span>
      )}
    </div>
  );
}

export default ToolButton;

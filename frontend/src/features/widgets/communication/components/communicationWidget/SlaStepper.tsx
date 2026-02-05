import { Button } from '@/common/components/shadcn/button';
import { useState, useRef, useEffect } from 'react';
import { LuMinus, LuPlus } from 'react-icons/lu';

interface SlaStepperProps {
  responseTime: number;
  onChange: (value: number) => void;
}

export function SlaStepper({ responseTime, onChange }: SlaStepperProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDecrement = (e: React.MouseEvent) => {
    if (responseTime > 1) onChange(responseTime - 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    if (responseTime < 48) onChange(responseTime + 1);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(val)) onChange(Math.max(1, Math.min(48, val)));
  };

  return (
    <div className="space-y-3">
      <h3 className="text-secondary-foreground text-sm font-semibold">
        응답 시간
      </h3>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <Button
          variant={'ghost'}
          onClick={handleDecrement}
          className="hover:bg-accent hover:text-accent-foreground text-muted-foreground/80 h-8 w-8 transition-colors disabled:opacity-50"
          disabled={responseTime <= 1}
        >
          <LuMinus size={16} />
        </Button>

        <div
          className="relative min-w-12 cursor-pointer text-center"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          {isEditing ? (
            <input
              ref={inputRef}
              type="number"
              value={responseTime}
              onChange={handleChange}
              onBlur={handleBlur}
              className="bg-background text-foreground focus:ring-primary/20 w-16 rounded-md border px-1 py-1 text-center text-sm font-bold focus:ring-2 focus:outline-none"
              min={1}
              max={48}
            />
          ) : (
            <div className="flex flex-col items-center leading-none">
              <span className="text-foreground text-lg font-bold">
                {responseTime}
              </span>
              <span className="text-muted-foreground text-[10px]">hours</span>
            </div>
          )}
        </div>

        <Button
          variant={'ghost'}
          onClick={handleIncrement}
          className="hover:bg-accent hover:text-accent-foreground text-muted-foreground/80 flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:opacity-50"
          disabled={responseTime >= 48}
        >
          <LuPlus size={16} />
        </Button>
      </div>
    </div>
  );
}

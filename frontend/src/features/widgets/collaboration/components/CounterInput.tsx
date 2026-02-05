import { Button } from '@/common/components/shadcn/button';

export default function CounterInput({
  value,
  setValue,
  editValue,
  setEditValue,
  isTime,
  max,
}: {
  value: number;
  setValue: (value: number) => void;
  editValue: boolean;
  setEditValue: (value: boolean) => void;
  isTime?: boolean;
  max: number;
}) {
  const handleEnter = (
    e: React.KeyboardEvent<HTMLInputElement>,
    setter: () => void,
  ) => {
    if (e.key === 'Enter') setter();
  };
  return (
    <div className="border-border flex w-fit items-center gap-3 rounded-lg border px-2 py-1">
      <Button
        variant={'default'}
        className="hover:bg-primary bg-muted text-muted-foreground hover:text-primary-foreground rounded px-2 py-1"
        onClick={() => setValue(Math.max(1, value - 1))}
      >
        -
      </Button>

      {editValue ? (
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="text-foreground w-6 bg-transparent text-center focus:outline-none"
          value={value}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              if (max && Number(value) > max) return;
              setValue(Number(value));
            }
          }}
          onBlur={() => setEditValue(false)}
          onKeyDown={(e) => handleEnter(e, () => setEditValue(false))}
        />
      ) : (
        <span
          className="text-primary w-6 cursor-pointer text-center"
          onClick={() => setEditValue(true)}
        >
          {value}
          {isTime ? 'h' : ''}
        </span>
      )}

      <Button
        variant={'default'}
        className="hover:bg-primary bg-muted text-muted-foreground hover:text-primary-foreground rounded px-2 py-1"
        onClick={() => setValue(max ? Math.min(max, value + 1) : value + 1)}
      >
        +
      </Button>
    </div>
  );
}

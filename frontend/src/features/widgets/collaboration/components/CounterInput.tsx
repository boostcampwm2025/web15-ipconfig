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
    <div className="flex w-fit items-center gap-3 rounded-lg border border-gray-700 px-2 py-1">
      <button
        className="hover:bg-primary rounded bg-gray-700 px-2 py-1 text-gray-200 hover:text-black"
        onClick={() => setValue(Math.max(1, value - 1))}
      >
        -
      </button>

      {editValue ? (
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-6 bg-transparent text-center focus:outline-none"
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

      <button
        className="hover:bg-primary rounded bg-gray-700 px-2 py-1 text-gray-200 hover:text-black"
        onClick={() => setValue(max ? Math.min(max, value + 1) : value + 1)}
      >
        +
      </button>
    </div>
  );
}

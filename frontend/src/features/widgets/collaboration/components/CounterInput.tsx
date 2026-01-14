export default function CounterInput({
  value,
  setValue,
  editValue,
  setEditValue,
  isTime,
}: {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  editValue: boolean;
  setEditValue: (value: boolean) => void;
  isTime?: boolean;
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
        onClick={() => setValue((p: number) => Math.max(1, p - 1))}
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
        onClick={() => setValue((p: number) => p + 1)}
      >
        +
      </button>
    </div>
  );
}

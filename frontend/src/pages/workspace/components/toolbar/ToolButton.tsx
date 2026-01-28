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
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${active ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'} ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
      >
        {icon}
      </button>
      {label && (
        <span className="pointer-events-none absolute left-14 z-50 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {label}
        </span>
      )}
    </div>
  );
}

export default ToolButton;

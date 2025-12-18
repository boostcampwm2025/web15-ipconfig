import { LuTrash2 } from 'react-icons/lu';

interface HeaderProps {
  title: string;
  icon: React.ReactNode;
  onRemove: () => void;
}

export default function ModalHeader({ title, icon, onRemove }: HeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-2 select-none">
      <h4 className="flex items-center gap-2 font-bold text-white">
        {icon} {title}
      </h4>
      <button
        onMouseDown={(e) => e.stopPropagation()}
        onClick={onRemove}
        className="text-gray-500 transition-colors hover:cursor-pointer hover:text-blue-400"
      >
        <LuTrash2 size={16} />
      </button>
    </div>
  );
}

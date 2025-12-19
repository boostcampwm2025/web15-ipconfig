import { LuTrash2 } from 'react-icons/lu';

interface HeaderProps {
  title: string;
  icon: React.ReactNode;
}

function WidgetHeader({ title, icon }: HeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-2 select-none">
      <h4 className="flex items-center gap-2 font-bold text-white">
        {icon} {title}
      </h4>
      <button
        onMouseDown={(e) => e.stopPropagation()}
        className="text-gray-500 transition-colors hover:text-red-400"
      >
        <LuTrash2 size={16} />
      </button>
    </div>
  );
}

export default WidgetHeader;

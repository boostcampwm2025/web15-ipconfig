import { LuTrash2 } from 'react-icons/lu';

interface HeaderProps {
  title: string;
  icon: React.ReactNode;
  onClickDelete: () => void;
}

function WidgetHeader({ title, icon, onClickDelete }: HeaderProps) {
  return (
    <div
      className="mb-4 flex cursor-move items-center justify-between border-b border-gray-700 pb-2 select-none"
      data-widget-header="true"
    >
      <h4 className="flex items-center gap-2 font-bold text-white">
        {icon} {title}
      </h4>
      <button
        onMouseDown={(e) => e.stopPropagation()}
        className="text-gray-500 transition-colors hover:text-red-400"
      >
        <LuTrash2 size={16} onClick={onClickDelete} />
      </button>
    </div>
  );
}

export default WidgetHeader;

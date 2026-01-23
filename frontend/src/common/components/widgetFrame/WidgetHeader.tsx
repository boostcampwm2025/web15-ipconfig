import type { WidgetLayout } from '@/common/types/widgetData';
import { LuTrash2 } from 'react-icons/lu';
import { useWidgetIdAndType } from './context/WidgetContext';
import { emitDeleteWidget } from '@/common/api/socket';

export interface WidgetHeaderProps {
  title: string;
  icon: React.ReactNode;
  actions?: React.ReactNode[];
  defaultLayout?: WidgetLayout;
}

function WidgetHeader({ title, icon, actions }: WidgetHeaderProps) {
  const { widgetId } = useWidgetIdAndType();
  return (
    <div
      className="mb-4 flex cursor-grabbing items-center justify-between border-b border-gray-700 pb-2 select-none"
      data-widget-header="true"
    >
      <h4 className="flex shrink-0 items-center gap-2 font-bold text-white">
        {icon} {title}
      </h4>

      <div className="flex items-center gap-2">
        {actions}
        <button
          onMouseDown={(e) => e.stopPropagation()}
          className="text-gray-500 transition-colors hover:text-red-400"
        >
          <LuTrash2
            size={16}
            onClick={() => {
              emitDeleteWidget(widgetId);
            }}
          />
        </button>
      </div>
    </div>
  );
}

export default WidgetHeader;

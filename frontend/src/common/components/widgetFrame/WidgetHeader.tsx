import type { WidgetLayout } from '@/common/types/widgetData';
import { LuTrash2 } from 'react-icons/lu';
import { useWidgetIdAndType } from './context/WidgetContext';
import { deleteWidgetAction } from '@/common/api/yjs/actions/widgetFrame';
import { Button } from '@/common/components/shadcn/button';

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
        <Button
          variant="ghost"
          size="icon"
          onMouseDown={(e) => e.stopPropagation()}
          className="h-auto w-auto p-0 text-gray-500 hover:bg-transparent hover:text-red-400"
          onClick={() => {
            deleteWidgetAction(widgetId);
          }}
        >
          <LuTrash2 size={16} />
        </Button>
      </div>
    </div>
  );
}

export default WidgetHeader;

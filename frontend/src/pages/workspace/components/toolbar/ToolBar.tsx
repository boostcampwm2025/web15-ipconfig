import ToolButton from './ToolButton';
import { LuMousePointer2 } from 'react-icons/lu';
import { LuLayers } from 'react-icons/lu';
import type { WidgetType, WidgetData } from '@/common/types/widgetData';

interface ToolBarProps {
  onTechStackClick: (type: WidgetType, data: WidgetData) => void;
}

function ToolBar({ onTechStackClick }: ToolBarProps) {
  return (
    <aside className="z-40 flex w-16 shrink-0 flex-col items-center gap-6 border-r border-gray-700 bg-gray-800 py-6">
      <div className="flex flex-col gap-4">
        <ToolButton
          icon={<LuMousePointer2 size={20} />}
          label="Select"
          active
        />

        <div className="h-px w-8 bg-gray-700" />

        <ToolButton
          icon={<LuLayers size={20} />}
          label="기술 스택"
          onClick={() => {
            onTechStackClick('TECH_STACK', {
              x: 0,
              y: 0,
              width: 300,
              height: 400,
              zIndex: 1,
              content: { widgetType: 'TECH_STACK', selectedItems: [] },
            });
          }}
        />
      </div>
    </aside>
  );
}

export default ToolBar;

import type { WidgetMetaData, WidgetType } from '@/common/types/widgetData';
import {
  LuLayers,
  LuGitBranch,
  LuMessageSquare,
  LuTrash2,
  LuUsers,
  LuListChecks,
} from 'react-icons/lu';
import { useWidgetFrame } from './WidgetFrame';

const WIDGET_TITLE_ICON: Record<WidgetType, WidgetMetaData> = {
  TECH_STACK: {
    title: 'Tech Stack',
    icon: <LuLayers />,
  },
  GIT_CONVENTION: {
    title: 'Git Convention',
    icon: <LuGitBranch />,
  },
  COLLABORATION: {
    title: 'Collaboration',
    icon: <LuUsers />,
  },
  COMMUNICATION: {
    title: 'Communication',
    icon: <LuMessageSquare />,
  },
};

function WidgetHeader() {
  const { type } = useWidgetFrame();

  const { icon, title } = WIDGET_TITLE_ICON[type];

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
        <LuTrash2 size={16} onClick={() => {}} />
      </button>
    </div>
  );
}

export default WidgetHeader;

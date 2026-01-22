import type { WidgetMetaData, WidgetType } from '@/common/types/widgetData';
import {
  LuLayers,
  LuGitBranch,
  LuMessageSquare,
  LuTrash2,
  LuUsers,
} from 'react-icons/lu';
import { useWidgetIdAndType } from './context/WidgetContext';
import { emitDeleteWidget } from '@/common/api/socket';
import { RiFontSizeAi } from 'react-icons/ri';

const WIDGET_TITLE_ICON: Record<WidgetType, WidgetMetaData> = {
  TECH_STACK: {
    title: '기술 스택',
    icon: <LuLayers className="text-blue-500" />,
  },
  GIT_CONVENTION: {
    title: 'Git 컨벤션',
    icon: <LuGitBranch className="text-green-500" />,
  },
  COLLABORATION: {
    title: '작업 및 협업',
    icon: <LuUsers className="text-purple-500" />,
  },
  COMMUNICATION: {
    title: '커뮤니케이션',
    icon: <LuMessageSquare className="text-yellow-500" />,
  },
  NAMING_CONVENTION: {
    title: '네이밍 컨벤션',
    icon: <RiFontSizeAi className="text-white-500" />,
  },
};

function WidgetHeader() {
  const { widgetId, type } = useWidgetIdAndType();

  const { icon, title } = WIDGET_TITLE_ICON[type];
  return (
    <div
      className="mb-4 flex cursor-grabbing items-center justify-between border-b border-gray-700 pb-2 select-none"
      data-widget-header="true"
    >
      <h4 className="flex items-center gap-2 font-bold text-white">
        {icon} {title}
      </h4>
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
  );
}

export default WidgetHeader;

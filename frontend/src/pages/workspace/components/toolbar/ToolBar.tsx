import ToolButton from './ToolButton';
import { LuMousePointer2, LuGitBranch } from 'react-icons/lu';
import { LuLayers, LuUsers, LuMessageSquare } from 'react-icons/lu';
import { RiFontSizeAi } from 'react-icons/ri';
import { createWidgetAction } from '@/common/api/yjs/actions/widgetFrame';
import { COLLABORATION_INITIAL_CONTENT } from '@/features/widgets/collaboration/constants/initial';
import { INITIAL_TECH_STACK_DATA } from '@/features/widgets/techStack/constant/initial';
import { INITIAL_GIT_CONVENTION_DATA } from '@/features/widgets/gitConvention/constants/initial';
import { INITIAL_COMMUNICATION_DATA } from '@/features/widgets/communication/constants/initial';

function ToolBar() {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2 rounded-2xl border border-gray-700 bg-gray-800 p-1.5 shadow-2xl backdrop-blur-xl transition-all hover:scale-105">
      <div className="flex items-center justify-center gap-2">
        <ToolButton
          icon={<LuMousePointer2 size={20} />}
          label="Select"
          active
        />
        <div className="h-6 w-px gap-2 bg-gray-500" />

        <ToolButton
          icon={<LuLayers size={20} />}
          label="기술 스택"
          onClick={() => {
            const widgetId = crypto.randomUUID();
            createWidgetAction({
              widgetId,
              type: 'TECH_STACK',
              layout: { x: 200, y: 200 },
              content: INITIAL_TECH_STACK_DATA,
            });
          }}
        />
        <ToolButton
          icon={<LuGitBranch size={20} />}
          label="Git Convention"
          onClick={() => {
            const widgetId = crypto.randomUUID();
            createWidgetAction({
              widgetId,
              type: 'GIT_CONVENTION',
              layout: { x: 500, y: 500 },
              content: INITIAL_GIT_CONVENTION_DATA,
            });
          }}
        />
        <ToolButton
          icon={<LuUsers size={20} />}
          label="작업 및 협업"
          onClick={() => {
            const widgetId = crypto.randomUUID();
            createWidgetAction({
              widgetId,
              type: 'COLLABORATION',
              layout: { x: 200, y: 200 },
              content: COLLABORATION_INITIAL_CONTENT,
            });
          }}
        />
        <ToolButton
          icon={<LuMessageSquare size={20} />}
          label="커뮤니케이션"
          onClick={() => {
            const widgetId = crypto.randomUUID();
            createWidgetAction({
              widgetId,
              type: 'COMMUNICATION',
              layout: { x: 200, y: 200 },
              content: INITIAL_COMMUNICATION_DATA,
            });
          }}
        />
        <ToolButton
          icon={<RiFontSizeAi size={20} />}
          label="네이밍 컨벤션"
          onClick={() => {
            const widgetId = crypto.randomUUID();
            createWidgetAction({
              widgetId,
              type: 'NAMING_CONVENTION',
              layout: { x: 200, y: 200 },
              content: {},
            });
          }}
        />
      </div>
    </div>
  );
}

export default ToolBar;

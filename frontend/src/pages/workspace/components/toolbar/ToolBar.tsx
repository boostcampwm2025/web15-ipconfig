import ToolButton from './ToolButton';
import {
  LuMousePointer2,
  LuGitBranch,
  LuLayers,
  LuUsers,
  LuMessageSquare,
  LuPalette,
} from 'react-icons/lu';
import { RiFontSizeAi } from 'react-icons/ri';
import { createWidgetAction } from '@/common/api/yjs/actions/widgetFrame';
import { COLLABORATION_INITIAL_CONTENT } from '@/features/widgets/collaboration/constants/initial';
import { INITIAL_TECH_STACK_DATA } from '@/features/widgets/techStack/constant/initial';
import { INITIAL_GIT_CONVENTION_DATA } from '@/features/widgets/gitConvention/constants/initial';
import { INITIAL_COMMUNICATION_DATA } from '@/features/widgets/communication/constants/initial';
import { checkWidgetLimit } from '@/common/lib/widget';
import { INITIAL_FORMAT_DATA } from '@/features/widgets/format/constants/initial';
import { NAMING_CONVENTION_INITIAL_CONTENT } from '@/features/widgets/namingConvention/constants/initial';
import { useFocusWidget } from '@/common/hooks/useFocusWidget';
import { getRandomWidgetLocation } from '@/common/lib/widgetLocation';
import { useCanvas } from '@/common/components/canvas/context/CanvasProvider';

function ToolBar() {
  const { focusWidget } = useFocusWidget();
  const { camera } = useCanvas();

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
              layout: getRandomWidgetLocation(camera),
              content: INITIAL_TECH_STACK_DATA,
            });
          }}
        />
        <ToolButton
          icon={<LuGitBranch size={20} />}
          label="깃 컨벤션"
          onClick={() => {
            if (
              !checkWidgetLimit(
                'GIT_CONVENTION',
                'Git Convention',
                1,
                focusWidget,
              )
            )
              return;

            const widgetId = 'GIT_CONVENTION';
            createWidgetAction({
              widgetId,
              type: 'GIT_CONVENTION',
              layout: getRandomWidgetLocation(camera),
              content: INITIAL_GIT_CONVENTION_DATA,
            });
          }}
        />
        <ToolButton
          icon={<LuUsers size={20} />}
          label="작업 및 협업"
          onClick={() => {
            if (
              !checkWidgetLimit('COLLABORATION', '작업 및 협업', 1, focusWidget)
            )
              return;
            const widgetId = 'COLLABORATION';
            createWidgetAction({
              widgetId,
              type: 'COLLABORATION',
              layout: getRandomWidgetLocation(camera),
              content: COLLABORATION_INITIAL_CONTENT,
            });
          }}
        />
        <ToolButton
          icon={<LuMessageSquare size={20} />}
          label="커뮤니케이션"
          onClick={() => {
            if (
              !checkWidgetLimit('COMMUNICATION', '커뮤니케이션', 1, focusWidget)
            )
              return;
            const widgetId = 'COMMUNICATION';
            createWidgetAction({
              widgetId,
              type: 'COMMUNICATION',
              layout: getRandomWidgetLocation(camera),
              content: INITIAL_COMMUNICATION_DATA,
            });
          }}
        />
        <ToolButton
          icon={<RiFontSizeAi size={20} />}
          label="네이밍 컨벤션"
          onClick={() => {
            if (
              !checkWidgetLimit(
                'NAMING_CONVENTION',
                '네이밍 컨벤션',
                1,
                focusWidget,
              )
            )
              return;
            const widgetId = 'NAMING_CONVENTION';
            createWidgetAction({
              widgetId,
              type: 'NAMING_CONVENTION',
              layout: getRandomWidgetLocation(camera),
              content: NAMING_CONVENTION_INITIAL_CONTENT,
            });
          }}
        />
        <ToolButton
          icon={<LuPalette size={20} />}
          label="포매팅"
          onClick={() => {
            if (!checkWidgetLimit('CODE_FORMAT', '포매팅', 1, focusWidget))
              return;
            const widgetId = 'CODE_FORMAT';
            createWidgetAction({
              widgetId,
              type: 'CODE_FORMAT',
              layout: getRandomWidgetLocation(camera),
              content: INITIAL_FORMAT_DATA,
            });
          }}
        />
      </div>
    </div>
  );
}

export default ToolBar;

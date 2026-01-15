import ToolButton from './ToolButton';
import { LuMousePointer2, LuGitBranch } from 'react-icons/lu';
import { LuLayers } from 'react-icons/lu';
import type { WidgetType, WidgetData } from '@/common/types/widgetData';

interface ToolBarProps {
  onToolClick: (type: WidgetType, data: WidgetData) => void;
}

function ToolBar({ onToolClick }: ToolBarProps) {
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
            onToolClick('TECH_STACK', {
              x: 0,
              y: 0,
              width: 500,
              zIndex: 1,
              content: { widgetType: 'TECH_STACK', selectedItems: [] },
            });
          }}
        />
        <ToolButton
          icon={<LuGitBranch size={20} />}
          label="Git Convention"
          onClick={() => {
            onToolClick('GIT_CONVENTION', {
              x: 0,
              y: 0,
              width: 500,
              zIndex: 1,
              content: {
                widgetType: 'GIT_CONVENTION',
                data: {
                  strategy: 'GITHUB_FLOW',
                  branchRules: {
                    mainBranch: 'main',
                    developBranch: 'develop',
                    prefixes: [],
                  },
                  commitConvention: { useGitmoji: false, commitTypes: [] },
                },
              },
            });
          }}
        />
      </div>
    </aside>
  );
}

export default ToolBar;

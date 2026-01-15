import ToolButton from './ToolButton';
import { LuMousePointer2, LuGitBranch } from 'react-icons/lu';
import { LuLayers } from 'react-icons/lu';
import type { WidgetType, WidgetData } from '@/common/types/widgetData';

interface ToolBarProps {
  onToolClick: (type: WidgetType, data: WidgetData) => void;
}

function ToolBar({ onToolClick }: ToolBarProps) {
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
    </div>
  );
}

export default ToolBar;

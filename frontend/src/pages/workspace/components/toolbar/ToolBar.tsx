import ToolButton from './ToolButton';
import {
  LuMousePointer2,
  LuGitBranch,
  LuLayers,
  LuUsers,
  LuMessageSquare,
} from 'react-icons/lu';
import { RiFontSizeAi } from 'react-icons/ri';
import type { TechStackData } from '@/common/types/widgetData';
import type { CollaborationData } from '@/features/widgets/collaboration/components/CollaborationWidget';
import type { CommunicationData } from '@/features/widgets/communication/types/communication';
import type { NamingConventionData } from '@/features/widgets/namingConvention/types/namingConvention';
import { emitCreateWidget } from '@/common/api/socket';

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
            emitCreateWidget({
              widgetId,
              type: 'TECH_STACK',
              layout: { x: 200, y: 200, width: 500 },
              content: { selectedItems: [] } as TechStackData,
            });
          }}
        />
        <ToolButton
          icon={<LuGitBranch size={20} />}
          label="Git Convention"
          onClick={() => {
            const widgetId = crypto.randomUUID();
            emitCreateWidget({
              widgetId,
              type: 'GIT_CONVENTION',
              layout: { x: 500, y: 500, width: 500 },
              content: {
                strategy: 'GITHUB_FLOW',
                branchRules: {
                  mainBranch: 'main',
                  prefixes: ['feature', 'fix', 'refactor'],
                },
                commitConvention: {
                  useGitmoji: false,
                  commitTypes: [
                    'feat',
                    'fix',
                    'refactor',
                    'chore',
                    'docs',
                    'test',
                  ],
                },
              },
            });
          }}
        />
        <ToolButton
          icon={<LuUsers size={20} />}
          label="협업"
          onClick={() => {
            const widgetId = crypto.randomUUID();
            emitCreateWidget({
              widgetId,
              type: 'COLLABORATION',
              layout: { x: 200, y: 200, width: 800 },
              content: {
                prRules: {
                  activeVersion: 'semantic',
                  selectedLabels: ['feature', 'fix', 'refactor'],
                  activeStrategy: 'squash',
                },
                reviewPolicy: {
                  approves: 2,
                  maxReviewHours: 24,
                  blockMerge: true,
                },
                workflow: {
                  platform: '',
                  cycleValue: 2,
                  cycleUnit: 'week',
                },
              } as CollaborationData,
            });
          }}
        />
        <ToolButton
          icon={<LuMessageSquare size={20} />}
          label="커뮤니케이션"
          onClick={() => {
            const widgetId = crypto.randomUUID();
            emitCreateWidget({
              widgetId,
              type: 'COMMUNICATION',
              layout: { x: 300, y: 300, width: 550 },
              content: {
                communication: {
                  urgent: 'Phone',
                  sync: 'Slack',
                  async: 'Notion',
                  official: 'Email',
                },
                sla: {
                  responseTime: 24,
                },
                timeManagement: {
                  coreTimeStart: '10:00',
                  coreTimeEnd: '17:00',
                },
                meeting: {
                  noMeetingDay: 'Wed',
                  feedbackStyle: 'Honest',
                },
              } as CommunicationData,
            });
          }}
        />
        <ToolButton
          icon={<RiFontSizeAi size={20} />}
          label="네이밍 컨벤션"
          onClick={() => {
            const widgetId = crypto.randomUUID();
            emitCreateWidget({
              widgetId,
              type: 'NAMING_CONVENTION',
              layout: { x: 400, y: 400, width: 600 },
              content: {
                frontend: {
                  variable: 'camelCase',
                  function: 'camelCase',
                  component: 'PascalCase',
                  constant: 'UPPER_SNAKE_CASE',
                },
                backend: {
                  variable: 'camelCase',
                  function: 'camelCase',
                  class: 'PascalCase',
                  constant: 'UPPER_SNAKE_CASE',
                },
                database: {
                  table: 'snake_case',
                  column: 'snake_case',
                  index: 'snake_case',
                  constraint: 'snake_case',
                },
                common: {
                  utility: 'camelCase',
                  constant: 'UPPER_SNAKE_CASE',
                  type: 'PascalCase',
                  enum: 'PascalCase',
                },
              } as NamingConventionData,
            });
          }}
        />
      </div>
    </div>
  );
}

export default ToolBar;

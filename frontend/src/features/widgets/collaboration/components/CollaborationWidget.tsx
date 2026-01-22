import CodeReviewPolicy from './CodeReviewPolicy';
import PRRules from './PRRules';
import TaskWorkflow from './TaskWorkflow';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import { emitUpdateWidget } from '@/common/api/socket';
import { useCollaboration } from '../hooks/useCollaboration';

export interface CollaborationData {
  prRules: {
    activeVersion: string;
    selectedLabels: string[];
    activeStrategy: string;
  };
  reviewPolicy: {
    approves: number;
    maxReviewHours: number;
    blockMerge: boolean;
  };
  workflow: {
    platform: string;
    cycleValue: number;
    cycleUnit: string;
  };
}

const defaultData: CollaborationData = {
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
};

export default function CollaborationWidget() {
  const { widgetId } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  ) as CollaborationData | undefined;

  const collaborationContent = content ?? defaultData;

  const { prRules, reviewPolicy, workflow, actions } = useCollaboration({
    data: collaborationContent,
    onDataChange: (nextData) => {
      emitUpdateWidget(widgetId, nextData);
    },
  });

  return (
    <div className="grid w-[800px] grid-cols-1 gap-2 md:grid-cols-2">
      <div className="w-full justify-self-center">
        <CodeReviewPolicy
          data={reviewPolicy}
          onUpdate={(key, value) => {
            actions.updateReviewPolicy({ [key]: value });
          }}
        />
      </div>
      <div className="row-span-2 w-full justify-self-center">
        <PRRules
          data={prRules}
          onUpdate={(key, value) => {
            actions.updatePRRules({ [key]: value });
          }}
        />
      </div>

      <div className="w-full justify-self-center">
        <TaskWorkflow
          data={workflow}
          onUpdate={(key, value) => {
            actions.updateWorkflow({ [key]: value });
          }}
        />
      </div>
    </div>
  );
}

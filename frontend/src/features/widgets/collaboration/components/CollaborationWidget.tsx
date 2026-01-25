import {
  updateMultiSelectorPickAction,
  updatePrimitiveFieldAction,
  updateSelectorPickAction,
} from '@/common/api/yjs/actions/widgetContent';
import type { MultiSelector, Selector } from '@/common/types/yjsDoc';
import { useShallow } from 'zustand/react/shallow';
import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { LuUsers } from 'react-icons/lu';
import CodeReviewPolicy from './CodeReviewPolicy';
import PRRules from './PRRules';
import TaskWorkflow from './TaskWorkflow';

export interface CollaborationData {
  prRules: {
    activeVersion: Selector;
    selectedLabels: MultiSelector;
    activeStrategy: Selector;
  };
  reviewPolicy: {
    approves: number;
    maxReviewHours: number;
    blockMerge: boolean;
  };
  workflow: {
    platform: Selector;
    cycleValue: number;
    cycleUnit: string;
  };
}

export default function CollaborationWidget() {
  const { widgetId, type } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  );

  const collaborationData = content as CollaborationData;

  // Defaults for safety
  const prRules = collaborationData?.prRules ?? {
    activeVersion: { selectedId: 'semantic', options: {} },
    selectedLabels: {
      selectedIds: ['feature', 'fix', 'refactor'],
      options: {},
    },
    activeStrategy: { selectedId: 'squash', options: {} },
  };

  const reviewPolicy = collaborationData?.reviewPolicy ?? {
    approves: 2,
    maxReviewHours: 24,
    blockMerge: true,
  };

  const workflow = collaborationData?.workflow ?? {
    platform: { selectedId: '', options: {} },
    cycleValue: 2,
    cycleUnit: 'week',
  };

  const handlePRRulesUpdate = (
    key: keyof CollaborationData['prRules'],
    value: string | string[],
  ) => {
    if (key === 'selectedLabels') {
      updateMultiSelectorPickAction(widgetId, type, key, value as string[]);
    } else {
      updateSelectorPickAction(widgetId, type, key, value as string);
    }
  };

  const handleReviewPolicyUpdate = (
    key: keyof CollaborationData['reviewPolicy'],
    value: number | boolean,
  ) => {
    updatePrimitiveFieldAction(widgetId, type, key, value);
  };

  const handleWorkflowUpdate = (
    key: keyof CollaborationData['workflow'],
    value: string | number,
  ) => {
    if (key === 'platform') {
      updateSelectorPickAction(widgetId, type, key, value as string);
    } else {
      updatePrimitiveFieldAction(widgetId, type, key, value as string | number);
    }
  };

  return (
    <WidgetFrame
      title="작업 및 협업"
      icon={<LuUsers className="text-purple-500" />}
      defaultLayout={{ x: 1000, y: 1000 }}
    >
      <div className="grid w-[800px] grid-cols-1 gap-2 md:grid-cols-2">
        <div className="w-full justify-self-center">
          <CodeReviewPolicy
            data={reviewPolicy}
            onUpdate={handleReviewPolicyUpdate}
          />
        </div>
        <div className="row-span-2 w-full justify-self-center">
          <PRRules data={prRules} onUpdate={handlePRRulesUpdate} />
        </div>

        <div className="w-full justify-self-center">
          <TaskWorkflow data={workflow} onUpdate={handleWorkflowUpdate} />
        </div>
      </div>
    </WidgetFrame>
  );
}

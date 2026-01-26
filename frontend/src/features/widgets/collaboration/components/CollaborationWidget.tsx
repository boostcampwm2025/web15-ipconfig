import { useState } from 'react';
import CodeReviewPolicy from './CodeReviewPolicy';
import PRRules from './PRRules';
import TaskWorkflow from './TaskWorkflow';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { LuUsers } from 'react-icons/lu';

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

export default function CollaborationWidget() {
  const { widgetId } = useWidgetIdAndType();
  const widgetData = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  );

  const [prRules, setPrRules] = useState<CollaborationData['prRules']>({
    activeVersion: 'semantic',
    selectedLabels: ['feature', 'fix', 'refactor'],
    activeStrategy: 'squash',
  });

  const [reviewPolicy, setReviewPolicy] = useState<
    CollaborationData['reviewPolicy']
  >({
    approves: 2,
    maxReviewHours: 24,
    blockMerge: true,
  });

  const [workflow, setWorkflow] = useState<CollaborationData['workflow']>({
    platform: '',
    cycleValue: 2,
    cycleUnit: 'week',
  });

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
            onUpdate={(key, value) =>
              setReviewPolicy((prev) => ({ ...prev, [key]: value }))
            }
          />
        </div>
        <div className="row-span-2 w-full justify-self-center">
          <PRRules
            data={prRules}
            onUpdate={(key, value) =>
              setPrRules((prev) => ({ ...prev, [key]: value }))
            }
          />
        </div>

        <div className="w-full justify-self-center">
          <TaskWorkflow
            data={workflow}
            onUpdate={(key, value) =>
              setWorkflow((prev) => ({ ...prev, [key]: value }))
            }
          />
        </div>
      </div>
    </WidgetFrame>
  );
}

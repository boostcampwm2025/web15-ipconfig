import { useState } from 'react';
import WidgetContainer from '@/common/components/widgetFrame/WidgetContainer';
import CodeReviewPolicy from './CodeReviewPolicy';
import PRRules from './PRRules';
import TaskWorkflow from './TaskWorkflow';
import type { WidgetContent } from '@/common/types/widgetData';
import WidgetHeader from '@/common/components/widgetFrame/WidgetHeader';
import { LuUsers } from 'react-icons/lu';

export interface CollaborationState {
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

interface CollaborationWidgetProps {
  widgetId: string;
  data: {
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
  };
}
export default function CollaborationWidget({
  widgetId,
  data,
}: CollaborationWidgetProps) {
  const [prRules, setPrRules] = useState<CollaborationState['prRules']>({
    activeVersion: 'semantic',
    selectedLabels: ['feature', 'fix', 'refactor'],
    activeStrategy: 'squash',
  });

  const [reviewPolicy, setReviewPolicy] = useState<
    CollaborationState['reviewPolicy']
  >({
    approves: 2,
    maxReviewHours: 24,
    blockMerge: true,
  });

  const [workflow, setWorkflow] = useState<CollaborationState['workflow']>({
    platform: '',
    cycleValue: 2,
    cycleUnit: 'week',
  });

  return (
    <WidgetContainer
      id={widgetId}
      x={data.x}
      y={data.y}
      width={850}
      height={data.height}
      zIndex={data.zIndex}
    >
      <WidgetHeader
        title="작업 및 협업"
        icon={<LuUsers className="text-primary" size={18} />}
        onClickDelete={() => {}}
      />
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
    </WidgetContainer>
  );
}

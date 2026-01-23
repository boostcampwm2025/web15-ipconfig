import CodeReviewPolicy from './CodeReviewPolicy';
import PRRules from './PRRules';
import TaskWorkflow from './TaskWorkflow';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useCollaborationYjs } from '../hooks/useCollaborationYjs';

// 하위 컴포넌트 props 타입 호환을 위한 인터페이스
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

  const { prRules, reviewPolicy, workflow, actions } = useCollaborationYjs({
    widgetId,
  });

  return (
    <div className="grid w-[800px] grid-cols-1 gap-2 md:grid-cols-2">
      <div className="w-full justify-self-center">
        <CodeReviewPolicy
          data={reviewPolicy}
          onUpdate={(key, value) =>
            actions.updateReviewPolicy(
              key as keyof CollaborationData['reviewPolicy'],
              value,
            )
          }
        />
      </div>
      <div className="row-span-2 w-full justify-self-center">
        <PRRules
          data={prRules}
          onUpdate={(key, value) =>
            actions.updatePRRules(
              key as keyof CollaborationData['prRules'],
              value,
            )
          }
        />
      </div>

      <div className="w-full justify-self-center">
        <TaskWorkflow
          data={workflow}
          onUpdate={(key, value) =>
            actions.updateWorkflow(
              key as keyof CollaborationData['workflow'],
              value,
            )
          }
        />
      </div>
    </div>
  );
}

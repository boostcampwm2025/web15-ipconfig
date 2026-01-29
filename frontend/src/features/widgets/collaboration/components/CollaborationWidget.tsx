import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { LuUsers } from 'react-icons/lu';
import CodeReviewPolicy from './CodeReviewPolicy';
import PRRules from './PRRules';
import TaskWorkflow from './TaskWorkflow';
import useCollaborationWidget from '../hooks/useCollaborationWidget';

export default function CollaborationWidget() {
  const {
    prRules,
    reviewPolicy,
    workflow,
    handlePRRulesUpdate,
    handleReviewPolicyUpdate,
    handleWorkflowUpdate,
  } = useCollaborationWidget();

  return (
    <WidgetFrame
      title="작업 및 협업"
      icon={<LuUsers className="text-purple-500" />}
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

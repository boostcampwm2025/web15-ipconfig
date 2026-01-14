import WidgetContainer from '@/common/components/widget/WidgetContainer';
import CodeReviewPolicy from './CodeReviewPolicy';
import PRRules from './PRRules';
import TaskWorkflow from './TaskWorkflow';
import type { WidgetData } from '@/common/types/widgetData';
import WidgetHeader from '@/common/components/widget/WidgetHeader';
import { LuUsers } from 'react-icons/lu';

export default function CollaborationWidget({
  id,
  position,
  width,
  height,
}: WidgetData) {
  return (
    <WidgetContainer
      id={id}
      type="groundrule-collaboration"
      content="Collaboration"
      position={position}
      width={width}
      height={height}
    >
      <WidgetHeader
        title="작업 및 협업"
        icon={<LuUsers className="text-primary" size={18} />}
      />
      <div className="grid w-[800px] grid-cols-1 gap-2 md:grid-cols-2">
        <div className="w-full max-w-[400px] justify-self-center">
          <CodeReviewPolicy />
        </div>
        <div className="row-span-2 w-full max-w-[400px] justify-self-center">
          <PRRules />
        </div>

        <div className="w-full max-w-[400px] justify-self-center">
          <TaskWorkflow />
        </div>
      </div>
    </WidgetContainer>
  );
}

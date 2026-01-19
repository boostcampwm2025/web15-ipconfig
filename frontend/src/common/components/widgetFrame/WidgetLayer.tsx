import type {
  WidgetContent,
  WidgetData,
  WidgetType,
} from '@/common/types/widgetData';
import CollaborationWidget, {
  type CollaborationData,
} from '@/features/widgets/collaboration/components/CollaborationWidget';
import CommunicationWidget from '@/features/widgets/communication/components/communicationWidget/CommunicationWidget';
import GitConventionWidget from '@/features/widgets/gitConvention/components/gitConventionWidget/GitConventionWidget';
import TechStackWidget from '@/features/widgets/techStack/components/techStackWidget/TechStackWidget';
import WidgetFrame from './WidgetFrame';
import type { CommunicationData } from '@/features/widgets/communication/types/communication';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';

function WidgetLayer() {
  const { widgetList } = useWorkspaceWidgetStore();
  return (
    <>
      {widgetList.map(({ widgetId, type, layout, content }) => (
        <WidgetFrame
          widgetId={widgetId}
          type={type}
          layout={layout}
          content={content}
        >
          <WidgetContent type={type} />
        </WidgetFrame>
      ))}

      <WidgetFrame
        widgetId={'COLLABORATION'}
        type={'COLLABORATION'}
        layout={{ x: 500, y: 500, zIndex: 0 }}
        content={
          {
            prRules: {
              activeVersion: 'semantic',
              selectedLabels: ['feature', 'fix', 'refactor'],
              activeStrategy: 'squash',
            },
          } as CollaborationData
        }
      >
        <CollaborationWidget />
      </WidgetFrame>

      <WidgetFrame
        widgetId={'COMMUNICATION'}
        type={'COMMUNICATION'}
        layout={{ x: 500, y: 500, zIndex: 0 }}
        content={
          {
            communication: {
              urgent: 'Phone',
              sync: 'Slack',
              async: 'Notion',
              official: 'Email',
            },
            sla: {
              responseTime: 24,
            },
          } as CommunicationData
        }
      >
        <CommunicationWidget />
      </WidgetFrame>
    </>
  );
}

interface WidgetContentProps {
  type: WidgetType;
}

function WidgetContent({ type }: WidgetContentProps) {
  switch (type) {
    case 'TECH_STACK':
      return <TechStackWidget />;
    case 'GIT_CONVENTION':
      return <GitConventionWidget />;
    default:
      return null;
  }
}

export default WidgetLayer;

import { useMemo } from 'react';
import type { WidgetType } from '@/common/types/widgetData';
import CollaborationWidget from '@/features/widgets/collaboration/components/CollaborationWidget';
import CommunicationWidget from '@/features/widgets/communication/components/communicationWidget/CommunicationWidget';
import GitConventionWidget from '@/features/widgets/gitConvention/components/gitConventionWidget/GitConventionWidget';
import TechStackWidget from '@/features/widgets/techStack/components/techStackWidget/TechStackWidget';
import WidgetFrame from './WidgetFrame';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import NamingConventionWidget from '@/features/widgets/namingConvention/components/NamingConventionWidget';

function WidgetLayer() {
  const widgetKeys = useWorkspaceWidgetStore(
    useShallow((state) =>
      state.widgetList.map((widget) => `${widget.widgetId}::${widget.type}`),
    ),
  );
  const widgetIds = useMemo(
    () =>
      widgetKeys.map((key) => {
        const [widgetId, type] = key.split('::') as [string, WidgetType];
        return { widgetId, type };
      }),
    [widgetKeys],
  );
  return (
    <>
      {widgetIds.map(({ widgetId, type }) => (
        <WidgetFrame key={widgetId} widgetId={widgetId} type={type}>
          <WidgetContent type={type} />
        </WidgetFrame>
      ))}
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
    case 'COLLABORATION':
      return <CollaborationWidget />;
    case 'COMMUNICATION':
      return <CommunicationWidget />;
    case 'NAMING_CONVENTION':
      return <NamingConventionWidget />;
    default:
      return null;
  }
}

export default WidgetLayer;

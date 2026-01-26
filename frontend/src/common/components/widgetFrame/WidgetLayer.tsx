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
import FormatWidget from '@/features/widgets/format/components/FormatWidget';
import { WidgetProvider } from './context/WidgetContext';

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
        <WidgetProvider widgetId={widgetId} type={type}>
          <WidgetContent type={type} />
        </WidgetProvider>
      ))}

      <WidgetProvider widgetId={'COLLABORATION'} type={'COLLABORATION'}>
        <CollaborationWidget />
      </WidgetProvider>

      <WidgetProvider widgetId={'COMMUNICATION'} type={'COMMUNICATION'}>
        <CommunicationWidget />
      </WidgetProvider>

      <WidgetProvider widgetId={'NAMING_CONVENTION'} type={'NAMING_CONVENTION'}>
        <NamingConventionWidget />
      </WidgetProvider>

      <WidgetProvider widgetId={'CODE_FORMAT'} type={'CODE_FORMAT'}>
        <FormatWidget />
      </WidgetProvider>
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

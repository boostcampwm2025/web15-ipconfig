import { useMemo } from 'react';
import type { WidgetType } from '@/common/types/widgetData';
import CollaborationWidget from '@/features/widgets/collaboration/components/CollaborationWidget';
import CommunicationWidget from '@/features/widgets/communication/components/communicationWidget/CommunicationWidget';
import TechStackWidget from '@/features/widgets/techStack/components/techStackWidget/TechStackWidget';
import { TechStackWidgetGroup } from '@/features/widgets/techStack/components/TechStackWidgetGroup';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import NamingConventionWidget from '@/features/widgets/namingConvention/components/NamingConventionWidget';
import { WidgetProvider } from './context/WidgetContext';
import { GitConventionWidget } from '@/features/widgets/gitConvention';
import { DockerfileBuilderWidget } from '@/features/widgets/dockerfile';
import { FormatWidget } from '@/features/widgets/format';

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

  const techStackWidgets = widgetIds.filter(
    ({ type }) => type === 'TECH_STACK',
  );

  const otherWidgets = widgetIds.filter(({ type }) => type !== 'TECH_STACK');

  return (
    <>
      <TechStackWidgetGroup>
        {techStackWidgets.map(({ widgetId, type }) => (
          <WidgetProvider key={widgetId} widgetId={widgetId} type={type}>
            <TechStackWidget />
          </WidgetProvider>
        ))}
      </TechStackWidgetGroup>

      {otherWidgets.map(({ widgetId, type }) => (
        <WidgetProvider key={widgetId} widgetId={widgetId} type={type}>
          <WidgetContent type={type} />
        </WidgetProvider>
      ))}
    </>
  );
}

interface WidgetContentProps {
  type: WidgetType;
}

function WidgetContent({ type }: WidgetContentProps) {
  switch (type) {
    case 'GIT_CONVENTION':
      return <GitConventionWidget />;
    case 'COLLABORATION':
      return <CollaborationWidget />;
    case 'COMMUNICATION':
      return <CommunicationWidget />;
    case 'NAMING_CONVENTION':
      return <NamingConventionWidget />;
    case 'CODE_FORMAT':
      return <FormatWidget />;
    case 'DOCKERFILE':
      return <DockerfileBuilderWidget />;
    default:
      return null;
  }
}

export default WidgetLayer;

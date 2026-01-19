import type {
  MoveWidgetData,
  WidgetContent,
  Widgets,
} from '@/common/types/widgetData';
import CollaborationWidget from '@/features/widgets/collaboration/components/CollaborationWidget';
import CommunicationWidget from '@/features/widgets/communication/components/communicationWidget/CommunicationWidget';
import GitConventionWidget from '@/features/widgets/gitConvention/components/gitConventionWidget/GitConventionWidget';
import TechStackWidget from '@/features/widgets/techStack/components/techStackWidget/TechStackWidget';

function WidgetLayer({
  widgets,
  // emitUpdateWidget,
  // emitDeleteWidget,
  // emitMoveWidget,
}: {
  widgets: Widgets;
  // emitUpdateWidget: (widgetId: string, data: WidgetContent) => void;
  // emitDeleteWidget: (widgetId: string) => void;
  // emitMoveWidget: (widgetId: string, data: MoveWidgetData) => void;
}) {
  return (
    <>
      {Object.entries(widgets).map(([widgetId, widget]) => {
        switch (widget.content.widgetType) {
          case 'TECH_STACK':
            return (
              <TechStackWidget
                key={widgetId}
                widgetId={widgetId}
                data={widget}
                emitDeleteWidget={emitDeleteWidget}
                emitUpdateWidget={emitUpdateWidget}
                emitMoveWidget={emitMoveWidget}
              />
            );
          case 'GIT_CONVENTION':
            return (
              <GitConventionWidget
                key={widgetId}
                widgetId={widgetId}
                data={widget}
                emitDeleteWidget={emitDeleteWidget}
                emitUpdateWidget={emitUpdateWidget}
                emitMoveWidget={emitMoveWidget}
              />
            );
          default:
            return null;
        }
      })}
      <CollaborationWidget
        key={'GROUNDRULE_COLLABORATION'}
        widgetId={'GROUNDRULE_COLLABORATION'}
        data={{
          x: 800,
          y: 400,
          width: 850,
          height: 600,
          zIndex: 1,
        }}
      />
      <CommunicationWidget
        id="communication"
        position={{ x: 800, y: 1200 }}
        width={600}
        onDelete={() => emitDeleteWidget('communication')}
      />
    </>
  );
}

export default WidgetLayer;

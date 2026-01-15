import type { ReactNode } from 'react';
import type {
  MoveWidgetData,
  WidgetContent,
  WidgetData,
} from '@/common/types/widgetData';
import WidgetContainer from './WidgetContainer';
import WidgetHeader from './WidgetHeader';

interface WidgetShellProps {
  widgetId: string;
  data: WidgetData;
  title: string;
  icon: ReactNode;
  emitDeleteWidget: (widgetId: string) => void;
  emitMoveWidget: (widgetId: string, data: MoveWidgetData) => void;
  children: ReactNode;
}

function WidgetShell({
  widgetId,
  data,
  title,
  icon,
  emitDeleteWidget,
  emitMoveWidget,
  children,
}: WidgetShellProps) {
  return (
    <WidgetContainer
      id={widgetId}
      x={data.x}
      y={data.y}
      width={data.width}
      height={data.height}
      zIndex={data.zIndex}
      content={data.content as WidgetContent}
      emitMoveWidget={emitMoveWidget}
    >
      <WidgetHeader
        title={title}
        icon={icon}
        onClickDelete={() => emitDeleteWidget(widgetId)}
      />
      {children}
    </WidgetContainer>
  );
}

export default WidgetShell;

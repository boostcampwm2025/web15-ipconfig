import type { ReactNode } from 'react';
import type { WidgetContent, WidgetData } from '@/common/types/widgetData';
import WidgetContainer from './WidgetContainer';
import WidgetHeader from './WidgetHeader';

interface WidgetFrameProps {
  widgetId: string;
  data: WidgetData;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

function WidgetFrame({
  widgetId,
  data,
  title,
  icon,
  children,
}: WidgetFrameProps) {
  return (
    <WidgetContainer
      id={widgetId}
      x={data.x}
      y={data.y}
      width={data.width}
      height={data.height}
      zIndex={data.zIndex}
      content={data.content as WidgetContent}
    >
      <WidgetHeader
        title={title}
        icon={icon}
        onClickDelete={() => {
          // emitDeleteWidget(widgetId);
        }}
      />
      {children}
    </WidgetContainer>
  );
}

export default WidgetFrame;

import type { PropsWithChildren } from 'react';
import WidgetContainer from './WidgetContainer';
import WidgetHeader from './WidgetHeader';
import type { WidgetLayout } from '@/common/types/widgetData';

interface WidgetFrameProps {
  title: string;
  icon: React.ReactNode;
  actions?: React.ReactNode[];
  defaultLayout?: WidgetLayout;
}

function WidgetFrame({
  children,
  defaultLayout,
  ...props
}: PropsWithChildren<WidgetFrameProps>) {
  return (
    <WidgetContainer defaultLayout={defaultLayout}>
      <WidgetHeader {...props} />
      {children}
    </WidgetContainer>
  );
}

export default WidgetFrame;

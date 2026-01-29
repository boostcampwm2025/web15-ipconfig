import type { PropsWithChildren } from 'react';
import WidgetContainer from './WidgetContainer';
import WidgetHeader from './WidgetHeader';
import { ErrorBoundary } from '../ErrorBoundary';

interface WidgetFrameProps {
  title: string;
  icon: React.ReactNode;
  actions?: React.ReactNode[];
}

function WidgetFrame({
  children,
  ...props
}: PropsWithChildren<WidgetFrameProps>) {
  return (
    <ErrorBoundary>
      <WidgetContainer>
        <WidgetHeader {...props} />
        {children}
      </WidgetContainer>
    </ErrorBoundary>
  );
}

export default WidgetFrame;

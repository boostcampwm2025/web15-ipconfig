import type { PropsWithChildren } from 'react';
import WidgetContainer from './WidgetContainer';
import WidgetHeader from './WidgetHeader';
import { WidgetProvider } from './context/WidgetContext';
import type { WidgetIdAndType } from './context/WidgetContext';

function WidgetFrame({
  children,
  widgetId,
  type,
}: PropsWithChildren<WidgetIdAndType>) {
  return (
    <WidgetProvider widgetId={widgetId} type={type}>
      <WidgetContainer>
        <WidgetHeader />
        {children}
      </WidgetContainer>
    </WidgetProvider>
  );
}

export default WidgetFrame;

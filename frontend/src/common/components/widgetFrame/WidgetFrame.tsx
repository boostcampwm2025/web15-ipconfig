/* eslint-disable react-refresh/only-export-components */
import type { PropsWithChildren } from 'react';
import type { WidgetData } from '@/common/types/widgetData';
import WidgetContainer from './WidgetContainer';
import WidgetHeader from './WidgetHeader';
import { createContext } from '@/common/contexts/createContext';

export const [WidgetFrameProvider, useWidgetFrame] = createContext<WidgetData>({
  contextName: 'WidgetFrameContext',
  hookName: 'useWidgetFrame',
  providerName: 'WidgetFrameProvider',
});

function WidgetFrame({ children, ...props }: PropsWithChildren<WidgetData>) {
  return (
    <WidgetFrameProvider value={props}>
      <WidgetContainer>
        <WidgetHeader />
        {children}
      </WidgetContainer>
    </WidgetFrameProvider>
  );
}

export default WidgetFrame;

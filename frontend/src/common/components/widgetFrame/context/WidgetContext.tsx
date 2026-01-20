/* eslint-disable react-refresh/only-export-components */
import type { PropsWithChildren } from 'react';
import type { WidgetData } from '@/common/types/widgetData';
import { createContext } from '@/common/contexts/createContext';

export type WidgetIdAndType = Pick<WidgetData, 'widgetId' | 'type'>;

export const [WidgetFrameProvider, useWidgetFrame] =
  createContext<WidgetIdAndType>({
    contextName: 'WidgetFrameContext',
    hookName: 'useWidgetIdAndType',
    providerName: 'WidgetFrameProvider',
  });

export function WidgetProvider({
  children,
  widgetId,
  type,
}: PropsWithChildren<WidgetIdAndType>) {
  return (
    <WidgetFrameProvider value={{ widgetId, type }}>
      {children}
    </WidgetFrameProvider>
  );
}

export function useWidgetIdAndType() {
  const { widgetId, type } = useWidgetFrame();
  return { widgetId, type };
}

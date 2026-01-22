import * as Y from 'yjs';
import { doc } from '../instance';

export const getRootMap = () => doc.getMap('root');

export const getWidgetsMap = () =>
  getRootMap().get('widgets') as Y.Map<Y.Map<unknown>>;

export const getWidgetOrderArray = () =>
  getRootMap().get('widgetOrder') as Y.Array<string>;

export const getWidgetMap = (widgetId: string) => {
  return getWidgetsMap().get(widgetId);
};

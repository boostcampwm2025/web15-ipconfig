import type { WidgetList } from '@/common/types/widgetData';

export function getWidgetContents(widgetList: WidgetList, type: string) {
  const widget = widgetList.find((w) => w.type === type);
  const content = widget?.content || '아직 작성되지 않았습니다!';
  return JSON.stringify(content, null, 2);
}

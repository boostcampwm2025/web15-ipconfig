import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import type { WidgetType } from '@/common/types/widgetData';
import { toast } from 'sonner';

import type { WidgetData } from '@/common/types/widgetData';

export const checkWidgetLimit = (
  type: WidgetType,
  label: string,
  limit: number = 1,
  onLimitReached?: (existingWidget: WidgetData) => void,
): boolean => {
  const { widgetList } = useWorkspaceWidgetStore.getState();
  const existingWidgets = widgetList.filter((widget) => widget.type === type);
  const widgetCount = existingWidgets.length;

  if (widgetCount >= limit) {
    const limitMessage = limit === 1 ? '하나만' : `${limit}개까지만`;
    toast.warning(`${label} 위젯은 ${limitMessage} 생성할 수 있습니다.`);

    if (onLimitReached && existingWidgets.length > 0) {
      onLimitReached(existingWidgets[0]);
    }

    return false;
  }
  return true;
};

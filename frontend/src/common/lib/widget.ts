import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import type { WidgetType } from '@/common/types/widgetData';
import { toast } from 'sonner';

export const checkWidgetLimit = (
  type: WidgetType,
  label: string,
  limit: number = 1,
): boolean => {
  const { widgetList } = useWorkspaceWidgetStore.getState();
  const widgetCount = widgetList.filter(
    (widget) => widget.type === type,
  ).length;

  if (widgetCount >= limit) {
    const limitMessage = limit === 1 ? '하나만' : `${limit}개까지만`;
    toast.warning(`${label} 위젯은 ${limitMessage} 생성할 수 있습니다.`);
    return false;
  }
  return true;
};

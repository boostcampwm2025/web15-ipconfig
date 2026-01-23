import { useMemo } from 'react';
import { parseSubject } from '@/features/widgets/techStack/utils/parsing';
import { useYjsWidgetField } from '@/common/api/yjs/hooks/useYjsWidgetContent';
import { updateSelectorPickAction } from '@/common/api/yjs/actions/widgetContent';
import type { Selector } from '@/common/types/yjsDoc';

export function useSubjectYjs(widgetId: string) {
  const subjectSelector = useYjsWidgetField<Selector>(widgetId, 'subject');

  const selectedSubject = subjectSelector?.selectedId ?? '';

  const setSelectedSubject = (value: string) => {
    updateSelectorPickAction(widgetId, 'TECH_STACK', 'subject', value);
  };

  const parsedSubject = useMemo(
    () => parseSubject(selectedSubject),
    [selectedSubject],
  );

  return { selectedSubject, setSelectedSubject, parsedSubject };
}

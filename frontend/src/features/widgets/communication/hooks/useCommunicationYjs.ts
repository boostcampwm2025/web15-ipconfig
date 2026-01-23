import { useMemo, useCallback } from 'react';
import { useYjsWidgetContent } from '@/common/api/yjs/hooks/useYjsWidgetContent';
import { updatePrimitiveFieldAction } from '@/common/api/yjs/actions/widgetContent';
import type { CommunicationData } from '../types/communication';
import type { CommunicationContent } from '@/common/types/yjsWidgetContent';

interface UseCommunicationYjsProps {
  widgetId: string;
}

/**
 * Yjs 기반 Communication 위젯 훅
 */
export function useCommunicationYjs({ widgetId }: UseCommunicationYjsProps) {
  const content = useYjsWidgetContent<CommunicationContent>(widgetId);

  // 데이터 매핑
  const communication = useMemo<CommunicationData['communication']>(() => {
    return {
      urgent: content?.communication?.urgent ?? '',
      sync: content?.communication?.sync ?? '',
      async: content?.communication?.async ?? '',
      official: content?.communication?.official ?? '',
    };
  }, [content?.communication]);

  const sla = useMemo<CommunicationData['sla']>(() => {
    return {
      responseTime: content?.sla?.responseTime ?? 24,
    };
  }, [content?.sla]);

  const timeManagement = useMemo<CommunicationData['timeManagement']>(() => {
    return {
      coreTimeStart: content?.timeManagement?.coreTimeStart ?? '10:00',
      coreTimeEnd: content?.timeManagement?.coreTimeEnd ?? '18:00',
    };
  }, [content?.timeManagement]);

  const meeting = useMemo<CommunicationData['meeting']>(() => {
    return {
      noMeetingDay: (content?.meeting?.noMeetingDay ??
        'None') as CommunicationData['meeting']['noMeetingDay'],
      feedbackStyle: (content?.meeting?.feedbackStyle ??
        'Soft') as CommunicationData['meeting']['feedbackStyle'],
    };
  }, [content?.meeting]);

  // 업데이트 액션
  const updateCommunication = useCallback(
    (key: keyof CommunicationData['communication'], value: string) => {
      updatePrimitiveFieldAction(
        widgetId,
        'COMMUNICATION',
        key as string,
        value,
      );
    },
    [widgetId],
  );

  const updateSla = useCallback(
    (key: keyof CommunicationData['sla'], value: number) => {
      updatePrimitiveFieldAction(
        widgetId,
        'COMMUNICATION',
        key as string,
        value,
      );
    },
    [widgetId],
  );

  const updateTimeManagement = useCallback(
    (key: keyof CommunicationData['timeManagement'], value: string) => {
      updatePrimitiveFieldAction(
        widgetId,
        'COMMUNICATION',
        key as string,
        value,
      );
    },
    [widgetId],
  );

  const updateMeeting = useCallback(
    (key: keyof CommunicationData['meeting'], value: string) => {
      updatePrimitiveFieldAction(
        widgetId,
        'COMMUNICATION',
        key as string,
        value,
      );
    },
    [widgetId],
  );

  return {
    communication,
    sla,
    timeManagement,
    meeting,
    actions: {
      updateCommunication,
      updateSla,
      updateTimeManagement,
      updateMeeting,
    },
  };
}

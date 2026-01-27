import type { CommunicationData } from '../types/communication';
import { INITIAL_COMMUNICATION_DATA } from '../constants/initial';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import {
  updatePrimitiveFieldAction,
  updateSelectorPickAction,
} from '@/common/api/yjs/actions/widgetContent';

export function useCommunication() {
  const { widgetId, type } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  );

  const data = (content as CommunicationData) || INITIAL_COMMUNICATION_DATA;

  // Ensure internal objects exist, fallback to initial data if missing (e.g. during creation)
  const communication =
    data.communication ?? INITIAL_COMMUNICATION_DATA.communication;
  const sla = data.sla ?? INITIAL_COMMUNICATION_DATA.sla;
  const timeManagement =
    data.timeManagement ?? INITIAL_COMMUNICATION_DATA.timeManagement;
  const meeting = data.meeting ?? INITIAL_COMMUNICATION_DATA.meeting;

  const updateCommunicationChannel = (channel: string, value: string) => {
    updateSelectorPickAction(widgetId, type, channel, value);
  };

  const updateSla = (value: number) => {
    updatePrimitiveFieldAction(widgetId, type, 'responseTime', value);
  };

  const updateTimeManagement = (
    key: keyof CommunicationData['timeManagement'],
    value: string,
  ) => {
    updatePrimitiveFieldAction(widgetId, type, key, value);
  };

  const updateMeeting = (
    key: keyof CommunicationData['meeting'],
    value: string,
  ) => {
    updatePrimitiveFieldAction(widgetId, type, key, value);
  };

  return {
    communication,
    sla,
    timeManagement,
    meeting,
    actions: {
      updateCommunicationChannel,
      updateSla,
      updateTimeManagement,
      updateMeeting,
    },
  };
}

import type { CommunicationData } from '../types/communication';

interface UseCommunicationProps {
  data: CommunicationData;
  onDataChange: (data: CommunicationData) => void;
}

export function useCommunication({
  data,
  onDataChange,
}: UseCommunicationProps) {
  const updateCommunication = (
    communication: Partial<CommunicationData['communication']>,
  ) => {
    onDataChange({
      ...data,
      communication: { ...data.communication, ...communication },
    });
  };

  const updateSLA = (sla: Partial<CommunicationData['sla']>) => {
    onDataChange({
      ...data,
      sla: { ...data.sla, ...sla },
    });
  };

  const updateTimeManagement = (
    timeManagement: Partial<CommunicationData['timeManagement']>,
  ) => {
    onDataChange({
      ...data,
      timeManagement: { ...data.timeManagement, ...timeManagement },
    });
  };

  const updateMeeting = (meeting: Partial<CommunicationData['meeting']>) => {
    onDataChange({
      ...data,
      meeting: { ...data.meeting, ...meeting },
    });
  };

  return {
    communication: data.communication,
    sla: data.sla,
    timeManagement: data.timeManagement,
    meeting: data.meeting,
    actions: {
      updateCommunication,
      updateSLA,
      updateTimeManagement,
      updateMeeting,
    },
  };
}

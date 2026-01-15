export interface CommunicationData {
  communication: {
    urgent: string;
    sync: string;
    async: string;
    official: string;
  };
  sla: {
    responseTime: number;
  };
  timeManagement: {
    coreTimeStart: string;
    coreTimeEnd: string;
  };
  meeting: {
    noMeetingDay:
      | 'None'
      | 'Mon'
      | 'Tue'
      | 'Wed'
      | 'Thu'
      | 'Fri'
      | 'Sat'
      | 'Sun';
    feedbackStyle: 'Soft' | 'Honest' | 'Retrospective';
  };
}

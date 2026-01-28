import type { CommunicationData } from '../types/communication';

export const DEFAULT_COMMUNICATION_DATA: CommunicationData = {
  communication: {
    urgent: 'Phone',
    sync: 'Slack',
    async: 'Notion',
    official: 'Email',
  },
  sla: {
    responseTime: 24,
  },
  timeManagement: {
    coreTimeStart: '10:00',
    coreTimeEnd: '17:00',
  },
  meeting: {
    noMeetingDay: 'Wed',
    feedbackStyle: 'Honest',
  },
};

export const COMMUNICATION_OPTIONS = {
  urgent: ['Phone', 'Slack Huddle', 'Zoom'],
  sync: ['Slack', 'Discord', 'Teams'],
  async: ['Notion', 'Jira', 'GitHub', 'Figma'],
  official: ['Email', 'Slack Channel', 'Townhall'],
};

export const CORE_TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  return `${i.toString().padStart(2, '0')}:00`;
});

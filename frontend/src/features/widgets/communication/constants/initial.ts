import type { CommunicationData } from '../types/communication';
import type { OptionItem } from '@/common/types/yjsDoc';
import { COMMUNICATION_OPTIONS } from './communication';

const createOptions = (items: readonly string[]) => {
  return items.reduce(
    (acc, item) => {
      acc[item] = { value: item, createdAt: Date.now() };
      return acc;
    },
    {} as Record<string, OptionItem>,
  );
};

export const INITIAL_COMMUNICATION_DATA: CommunicationData = {
  communication: {
    urgent: {
      selectedId: 'Phone',
      options: createOptions(COMMUNICATION_OPTIONS.urgent),
    },
    sync: {
      selectedId: 'Slack',
      options: createOptions(COMMUNICATION_OPTIONS.sync),
    },
    async: {
      selectedId: 'Notion',
      options: createOptions(COMMUNICATION_OPTIONS.async),
    },
    official: {
      selectedId: 'Email',
      options: createOptions(COMMUNICATION_OPTIONS.official),
    },
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

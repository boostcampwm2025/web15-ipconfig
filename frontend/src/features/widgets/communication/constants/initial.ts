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
    meeting: {
      selectedId: 'Phone',
      options: createOptions(COMMUNICATION_OPTIONS.meeting),
    },
    chat: {
      selectedId: 'Slack',
      options: createOptions(COMMUNICATION_OPTIONS.chat),
    },
    doc: {
      selectedId: 'Notion',
      options: createOptions(COMMUNICATION_OPTIONS.doc),
    },
    announce: {
      selectedId: 'Email',
      options: createOptions(COMMUNICATION_OPTIONS.announce),
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

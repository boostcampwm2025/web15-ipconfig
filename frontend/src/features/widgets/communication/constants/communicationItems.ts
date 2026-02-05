import {
  LuSiren,
  LuMessageCircle,
  LuFileText,
  LuMegaphone,
} from 'react-icons/lu';
import { COMMUNICATION_OPTIONS } from './communication';

export const COMMUNICATION_ITEMS = [
  {
    key: 'meeting',
    label: '회의',
    icon: LuSiren,
    options: COMMUNICATION_OPTIONS.meeting,
    color: 'text-red-500',
  },
  {
    key: 'doc',
    label: '기록',
    icon: LuFileText,
    options: COMMUNICATION_OPTIONS.doc,
    color: 'text-blue-500',
  },
  {
    key: 'announce',
    label: '공지',
    icon: LuMegaphone,
    options: COMMUNICATION_OPTIONS.announce,
    color: 'text-yellow-500',
  },
  {
    key: 'chat',
    label: '그 외 소통',
    icon: LuMessageCircle,
    options: COMMUNICATION_OPTIONS.chat,
    color: 'text-green-500',
  },
] as const;

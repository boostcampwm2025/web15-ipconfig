import {
  LuSiren,
  LuMessageCircle,
  LuFileText,
  LuMegaphone,
} from 'react-icons/lu';
import { COMMUNICATION_OPTIONS } from './communication';

export const COMMUNICATION_ITEMS = [
  {
    key: 'urgent',
    label: '긴급',
    icon: LuSiren,
    options: COMMUNICATION_OPTIONS.urgent,
    color: 'text-red-500',
  },
  {
    key: 'sync',
    label: '동기',
    icon: LuMessageCircle,
    options: COMMUNICATION_OPTIONS.sync,
    color: 'text-green-500',
  },
  {
    key: 'async',
    label: '비동기',
    icon: LuFileText,
    options: COMMUNICATION_OPTIONS.async,
    color: 'text-blue-500',
  },
  {
    key: 'official',
    label: '공식',
    icon: LuMegaphone,
    options: COMMUNICATION_OPTIONS.official,
    color: 'text-yellow-500',
  },
] as const;

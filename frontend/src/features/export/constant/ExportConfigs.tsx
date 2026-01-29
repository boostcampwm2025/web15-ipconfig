import type { ExportConfig } from '../types/exportConfigs';
import { LuFileJson } from 'react-icons/lu';

export const EXPORT_CONFIGS: ExportConfig[] = [
  {
    id: 'prettier',
    label: 'Prettier 설정',
    description: '.prettierrc 파일로 내보냅니다.',
    type: 'CODE_FORMAT',
    fileName: '.prettierrc',
    icon: <LuFileJson className="h-5 w-5 text-pink-500" />,
  },
  // {
  //   id: 'docker',
  //   label: 'Docker 설정',
  //   description: 'Dockerfile을 생성합니다. (준비 중)',
  //   fileName: 'Dockerfile',
  //   icon: <LuContainer className="h-5 w-5 text-blue-500" />,
  //   getContent: getDockerContent,
  // },
  // 추후 다른 설정 파일 위젯이 추가되면 여기에 설정을 추가하면 됨
];

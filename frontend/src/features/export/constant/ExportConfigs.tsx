import type { ExportConfig } from '../types/exportConfigs';

export const EXPORT_CONFIGS: ExportConfig[] = [
  {
    id: 'prettier',
    label: 'Prettier 설정',
    description: '.prettierrc 파일로 내보냅니다.',
    type: 'CODE_FORMAT',
    fileName: '.prettierrc',
  },
  {
    id: 'dockerfile',
    label: 'Dockerfile',
    description: 'Dockerfile을 생성합니다.',
    type: 'DOCKERFILE',
    fileName: 'Dockerfile',
  },
];

import 'github-markdown-css/github-markdown.css';
import type { WidgetList } from '@/common/types/widgetData';

export interface ExportConfig {
  id: string;
  label: string;
  description: string;
  fileName: string;
  icon: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getContent: (widgetList: any[]) => string;
}

export function getContent(widgetList: WidgetList, type: string) {
  const widget = widgetList.find((w) => w.type === type);
  const content = widget?.content || '아직 작성되지 않았습니다!';
  return JSON.stringify(content, null, 2);
}

// function getDockerContent(widgetList: WidgetList) {
//   // TODO: 추후 Docker 위젯 연동 시 실제 데이터로 교체
//   return `# Docker configuration\n\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\nCMD ["npm", "run", "start"]`;
// }

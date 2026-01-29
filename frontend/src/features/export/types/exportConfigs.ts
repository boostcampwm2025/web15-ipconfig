import 'github-markdown-css/github-markdown.css';

export interface ExportConfig {
  id: string;
  label: string;
  description: string;
  type: string;
  fileName: string;
  icon: React.ReactNode;
}

// function getDockerContent(widgetList: WidgetList) {
//   // TODO: 추후 Docker 위젯 연동 시 실제 데이터로 교체
//   return `# Docker configuration\n\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\nCMD ["npm", "run", "start"]`;
// }

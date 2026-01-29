import 'github-markdown-css/github-markdown.css';
import type { WidgetType } from '@/common/types/widgetData';

export interface ExportConfig {
  id: string;
  label: string;
  description: string;
  type: WidgetType;
  fileName: string;
}

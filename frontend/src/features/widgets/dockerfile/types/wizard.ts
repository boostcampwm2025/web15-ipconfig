import type { DockerfileData } from '@/common/types/yjsWidgetContent';
import type { LucideIcon } from 'lucide-react';

export type { DockerfileData };

export interface FrameworkOption {
  id: DockerfileData['framework'];
  label: string;
  icon: LucideIcon;
  description: string;
}

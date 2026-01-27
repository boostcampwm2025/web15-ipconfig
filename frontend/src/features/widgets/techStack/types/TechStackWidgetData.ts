import type { Selector } from '@/common/types/yjsDoc';
import type { TechStack } from './techStack';

export interface TechStackWidgetData {
  subject: Selector;
  techItems: TechStack[];
}

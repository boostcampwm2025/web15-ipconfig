import type { CollaborationData } from '@/features/widgets/collaboration/components/CollaborationWidget';
import type { CommunicationData } from '@/features/widgets/communication/types/communication';
import type { GitConventionData } from '@/features/widgets/gitConvention/types/gitConvention';
import type { TechStack } from '@/features/widgets/techStack/types/techStack';

export type WidgetType =
  | 'TECH_STACK'
  | 'GIT_CONVENTION'
  | 'COLLABORATION'
  | 'COMMUNICATION';

export type WidgetContent =
  | TechStackData
  | GitConventionData
  | CommunicationData
  | CollaborationData;

export interface TechStackData {
  selectedItems: TechStack[];
}

export interface WidgetData {
  widgetId: string;
  type: WidgetType;
  layout: WidgetLayout;
  content: WidgetContent;
}

export interface WidgetMetaData {
  title: string;
  icon: React.ReactNode;
}

export interface WidgetLayout {
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex?: number;
}

export type WidgetList = WidgetData[];

// export interface CreateWidgetData {
//   data: WidgetData;
// }

// export interface UpdateWidgetData {
//   widgetId: string;
//   data: {
//     // 임시로 이렇게 할게요...
//     content: WidgetContent;
//   };
// }

// export interface MoveWidgetData {
//   x?: number;
//   y?: number;
//   width?: number;
//   height?: number;
//   zIndex?: number;
// }

// export interface UpdateWidgetLayoutData {
//   widgetId: string;
//   data: MoveWidgetData;
// }

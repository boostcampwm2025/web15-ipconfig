import type { CollaborationData } from '@/features/widgets/collaboration/components/CollaborationWidget';
import type { CommunicationData } from '@/features/widgets/communication/types/communication';
import type { GitConventionData } from '@/features/widgets/gitConvention/types/gitConvention';
import type { TechStack } from '@/features/widgets/techStack/types/techStack';
import type { NamingConventionData } from '@/features/widgets/namingConvention/types/namingConvention';

export type {
  CollaborationData,
  CommunicationData,
  GitConventionData,
  TechStack,
};

export type WidgetType =
  | 'TECH_STACK'
  | 'GIT_CONVENTION'
  | 'COLLABORATION'
  | 'COMMUNICATION'
  | 'NAMING_CONVENTION';

export type WidgetContent =
  | TechStackData
  | GitConventionData
  | CommunicationData
  | CollaborationData
  | NamingConventionData;

export interface TechStackData {
  selectedItems: TechStack[];
  subject?: string;
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

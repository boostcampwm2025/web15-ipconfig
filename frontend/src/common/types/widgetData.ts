import type { CollaborationData } from '@/features/widgets/collaboration/types/CollaborationData';
import type { CommunicationData } from '@/features/widgets/communication/types/communication';
import type { GitConventionData } from '@/features/widgets/gitConvention/types/gitConvention';
import type { TechStack } from '@/features/widgets/techStack/types/techStack';
import type { TechStackWidgetData } from '@/features/widgets/techStack/types/TechStackWidgetData';
import type { NamingConventionData } from '@/features/widgets/namingConvention/types/namingConvention';
import type { DockerfileData } from '@/features/widgets/dockerfile/types/wizard';
import type { FormatData } from '@/features/widgets/format/types/format';

export type {
  CollaborationData,
  CommunicationData,
  GitConventionData,
  TechStack,
  TechStackWidgetData,
  DockerfileData,
  NamingConventionData,
  FormatData,
};

export type WidgetType =
  | 'TECH_STACK'
  | 'GIT_CONVENTION'
  | 'COLLABORATION'
  | 'COMMUNICATION'
  | 'NAMING_CONVENTION'
  | 'CODE_FORMAT'
  | 'DOCKERFILE';

export type WidgetContent =
  | TechStackWidgetData
  | GitConventionData
  | CommunicationData
  | CollaborationData
  | NamingConventionData
  | DockerfileData
  | FormatData;

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

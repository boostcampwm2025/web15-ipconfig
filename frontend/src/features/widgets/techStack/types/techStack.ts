import type {
  FrontendCategory,
  BackendCategory,
  DatabaseCategory,
  InfrastructureCategory,
  CommonCategory,
  TechStackCategory,
} from '@/features/widgets/techStack/types/techStackCategory';

export interface TechStack {
  id: string;
  category: TechStackCategory;
  name: string;
}

export interface FrontendTechStack extends TechStack {
  category: FrontendCategory;
}

export interface BackendTechStack extends TechStack {
  category: BackendCategory;
}

export interface DatabaseTechStack extends TechStack {
  category: DatabaseCategory;
}

export interface InfrastructureTechStack extends TechStack {
  category: InfrastructureCategory;
}

export interface CommonTechStack extends TechStack {
  category: CommonCategory;
}

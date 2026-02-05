export type CommonCategory =
  | 'language'
  | 'packageManager'
  | 'testing'
  | 'monorepoManagement'
  | 'codeQuality'
  | 'ide'
  | 'ai';

export type FrontendCategory =
  | 'framework'
  | 'styling'
  | 'stateManagement'
  | 'uiLibrary';

export type BackendCategory = 'framework' | 'apiArchitecture' | 'documentation';

export type DatabaseCategory =
  | 'mainDatabase'
  | 'ormAndQueryBuilder'
  | 'cachingAndMessageQueue'
  | 'fileStorage';

export type InfrastructureCategory =
  | 'deployment'
  | 'CI/CD'
  | 'monitoringAndLogging';

export type TechStackCategory =
  | FrontendCategory
  | BackendCategory
  | DatabaseCategory
  | InfrastructureCategory
  | CommonCategory;

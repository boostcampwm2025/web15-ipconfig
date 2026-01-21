export interface NamingConventionData {
  widgetType: 'NAMING_CONVENTION';
  frontend: FrontendNamingConvention;
  backend: BackendNamingConvention;
  database: DatabaseNamingConvention;
  common: CommonNamingConvention;
}

export interface FrontendNamingConvention {
  variable: NamingCase;
  function: NamingCase;
  component: NamingCase;
  constant: NamingCase;
}

export interface BackendNamingConvention {
  variable: NamingCase;
  function: NamingCase;
  class: NamingCase;
  constant: NamingCase;
}

export interface DatabaseNamingConvention {
  table: NamingCase;
  column: NamingCase;
  index: NamingCase;
  constraint: NamingCase;
}

export interface CommonNamingConvention {
  utility: NamingCase;
  constant: NamingCase;
  type: NamingCase;
  enum: NamingCase;
}

export type NamingCase =
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'UPPER_SNAKE_CASE'
  | 'kebab-case'
  | 'none';

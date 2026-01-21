export interface NamingData {
  widgetType: 'NAMING';
  frontend: {
    variable: NamingCase;
    function: NamingCase;
    component: NamingCase;
    constant: NamingCase;
  };
  backend: {
    variable: NamingCase;
    function: NamingCase;
    class: NamingCase;
    constant: NamingCase;
  };
}

export type NamingCase =
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'UPPER_SNAKE_CASE'
  | 'kebab-case'
  | 'none';

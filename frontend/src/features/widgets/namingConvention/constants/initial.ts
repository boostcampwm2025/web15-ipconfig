import type { NamingConventionContent } from '@/common/types/yjsWidgetContent';

export const NAMING_CONVENTION_INITIAL_CONTENT: NamingConventionContent = {
  frontend: {
    variable: 'camelCase',
    function: 'camelCase',
    component: 'PascalCase',
    constant: 'UPPER_SNAKE_CASE',
  },
  backend: {
    variable: 'camelCase',
    function: 'camelCase',
    class: 'PascalCase',
    constant: 'UPPER_SNAKE_CASE',
  },
  database: {
    table: 'snake_case',
    column: 'snake_case',
    index: 'snake_case',
    constraint: 'snake_case',
  },
  common: {
    utility: 'camelCase',
    constant: 'UPPER_SNAKE_CASE',
    type: 'PascalCase',
    enum: 'PascalCase',
  },
};

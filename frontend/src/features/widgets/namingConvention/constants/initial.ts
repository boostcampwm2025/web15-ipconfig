import type { NamingConventionContent } from '@/common/types/yjsWidgetContent';

export const NAMING_CONVENTION_INITIAL_CONTENT: NamingConventionContent = {
  frontend: {
    variable: 'none',
    function: 'none',
    component: 'none',
    constant: 'none',
  },
  backend: {
    variable: 'none',
    function: 'none',
    class: 'none',
    constant: 'none',
  },
  database: {
    table: 'none',
    column: 'none',
    index: 'none',
    constraint: 'none',
  },
  common: {
    utility: 'none',
    constant: 'none',
    type: 'none',
    enum: 'none',
  },
};

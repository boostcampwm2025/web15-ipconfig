export type Category = 'frontend' | 'backend' | 'database' | 'common';

export interface CategoryConfig {
  id: Category;
  label: string;
  title: string;
  titleColor: string;
  icon: React.ReactNode;
  description: string;
}

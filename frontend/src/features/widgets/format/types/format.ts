import type { FormatContent } from '@/common/types/yjsWidgetContent';

// Prettier 설정 가능한 옵션 항목
export interface PrettierConfig {
  printWidth: number;
  useTabs: boolean;
  tabWidth: number;
  semi: boolean;
  singleQuote: boolean;
  jsxSingleQuote: boolean;
  trailingComma: 'none' | 'es5' | 'all';
  bracketSpacing: boolean;
  arrowParens: 'avoid' | 'always';
  singleAttributePerLine: boolean;
}

// format 위젯 설정 옵션 인터페이스
export interface ConfigOption {
  key: keyof PrettierConfig;
  label: string;
  description: string;
  recommendation?: string;
  type: 'toggle' | 'select' | 'input';
  options?: {
    label: string;
    value: string | number | boolean;
    description?: string;
  }[];
}

export interface ActiveTip {
  label: string;
  description: string;
  recommendation?: string;
}

export type FormatData = FormatContent;

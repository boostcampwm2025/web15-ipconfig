import type {
  NamingCase,
  FrontendNamingConvention,
  BackendNamingConvention,
  DatabaseNamingConvention,
  CommonNamingConvention,
} from '../types/namingConvention';
import { ConventionRow } from './ConventionRow';

interface ConventionSectionProps {
  category: 'frontend' | 'backend' | 'database' | 'common';
  title: string;
  titleColor: string;
  convention:
    | FrontendNamingConvention
    | BackendNamingConvention
    | DatabaseNamingConvention
    | CommonNamingConvention;
  onChange: (key: string, value: NamingCase) => void;
  onHover: (key: string, label: string) => void;
}

interface FrontendFieldMapping {
  label: string;
  key: keyof FrontendNamingConvention;
}

interface BackendFieldMapping {
  label: string;
  key: keyof BackendNamingConvention;
}

interface DatabaseFieldMapping {
  label: string;
  key: keyof DatabaseNamingConvention;
}

interface CommonFieldMapping {
  label: string;
  key: keyof CommonNamingConvention;
}

const FRONTEND_FIELDS: FrontendFieldMapping[] = [
  { label: '변수', key: 'variable' },
  { label: '함수', key: 'function' },
  { label: '컴포넌트', key: 'component' },
  { label: '상수', key: 'constant' },
] as const;

const BACKEND_FIELDS: BackendFieldMapping[] = [
  { label: '변수', key: 'variable' },
  { label: '함수', key: 'function' },
  { label: '클래스', key: 'class' },
  { label: '상수', key: 'constant' },
] as const;

const DATABASE_FIELDS: DatabaseFieldMapping[] = [
  { label: '테이블', key: 'table' },
  { label: '컬럼', key: 'column' },
  { label: '인덱스', key: 'index' },
  { label: '제약조건', key: 'constraint' },
] as const;

const COMMON_FIELDS: CommonFieldMapping[] = [
  { label: '유틸리티', key: 'utility' },
  { label: '상수', key: 'constant' },
  { label: '타입', key: 'type' },
  { label: '열거형', key: 'enum' },
] as const;

export function ConventionSection({
  category,
  title,
  titleColor,
  convention,
  onChange,
  onHover,
}: ConventionSectionProps) {
  const getFields = () => {
    switch (category) {
      case 'frontend':
        return FRONTEND_FIELDS;
      case 'backend':
        return BACKEND_FIELDS;
      case 'database':
        return DATABASE_FIELDS;
      case 'common':
        return COMMON_FIELDS;
      default:
        return FRONTEND_FIELDS;
    }
  };

  const fields = getFields();

  const getValue = (field: { label: string; key: string }): NamingCase => {
    switch (category) {
      case 'frontend':
        return (convention as FrontendNamingConvention)[
          field.key as keyof FrontendNamingConvention
        ];
      case 'backend':
        return (convention as BackendNamingConvention)[
          field.key as keyof BackendNamingConvention
        ];
      case 'database':
        return (convention as DatabaseNamingConvention)[
          field.key as keyof DatabaseNamingConvention
        ];
      case 'common':
        return (convention as CommonNamingConvention)[
          field.key as keyof CommonNamingConvention
        ];
      default:
        return (convention as FrontendNamingConvention)[
          field.key as keyof FrontendNamingConvention
        ];
    }
  };

  return (
    <section className="mb-4">
      <h3 className={`${titleColor} mb-2 px-2 text-sm font-bold`}>{title}</h3>
      <div className="space-y-1">
        {fields.map((field) => {
          const value = getValue(field);

          return (
            <ConventionRow
              key={field.key}
              label={field.label}
              value={value as NamingCase}
              onChange={(v) => onChange(field.key, v)}
              onHover={() => onHover(field.key, field.label)}
            />
          );
        })}
      </div>
    </section>
  );
}

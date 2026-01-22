import type {
  NamingCase,
  FrontendNamingConvention,
  BackendNamingConvention,
  DatabaseNamingConvention,
  CommonNamingConvention,
} from '../types/namingConvention';
import { ConventionRow } from './ConventionRow';
import {
  FRONTEND_FIELDS,
  BACKEND_FIELDS,
  DATABASE_FIELDS,
  COMMON_FIELDS,
} from '../constants/namingFields';

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

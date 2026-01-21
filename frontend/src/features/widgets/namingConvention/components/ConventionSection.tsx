import type {
  NamingCase,
  FrontendNamingConvention,
  BackendNamingConvention,
} from '../types/namingConvention';
import { ConventionRow } from './ConventionRow';

interface ConventionSectionProps {
  category: 'frontend' | 'backend';
  title: string;
  titleColor: string;
  convention: FrontendNamingConvention | BackendNamingConvention;
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

export function ConventionSection({
  category,
  title,
  titleColor,
  convention,
  onChange,
  onHover,
}: ConventionSectionProps) {
  const fields = category === 'frontend' ? FRONTEND_FIELDS : BACKEND_FIELDS;

  return (
    <section className="mb-4">
      <h3 className={`${titleColor} mb-2 px-2 text-sm font-bold`}>{title}</h3>
      <div className="space-y-1">
        {fields.map((field) => {
          const value =
            category === 'frontend'
              ? (convention as FrontendNamingConvention)[
                  (field as FrontendFieldMapping).key
                ]
              : (convention as BackendNamingConvention)[
                  (field as BackendFieldMapping).key
                ];

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

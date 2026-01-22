import type {
  NamingConventionData,
  NamingCase,
} from '../types/namingConvention';

type Category = 'frontend' | 'backend' | 'database' | 'common';

interface UseNamingConventionProps {
  data: NamingConventionData;
  onDataChange: (data: NamingConventionData) => void;
}

export function useNamingConvention({
  data,
  onDataChange,
}: UseNamingConventionProps) {
  const updateNamingState = (
    section: Category,
    key: string,
    value: NamingCase,
  ) => {
    const sectionState = data[section];
    const updated = {
      ...data,
      [section]: {
        ...sectionState,
        [key]: value,
      },
    };
    onDataChange(updated);
  };

  return {
    frontend: data.frontend,
    backend: data.backend,
    database: data.database,
    common: data.common,
    actions: {
      updateNamingState,
    },
  };
}

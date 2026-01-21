// frontend/src/features/widgets/namingConvention/NamingConventionWidget.tsx
import { useState } from 'react';
import { Button } from '@/common/components/shadcn/button';
import type {
  NamingConventionData,
  NamingCase,
} from '../types/namingConvention';
import { GuidelineBox } from './GuidelineBox';
import { ConventionSection } from './ConventionSection';
import { NAMING_INFO } from '../constants/namingInfo';
import { FileCodeIcon, ServerIcon } from 'lucide-react';

type Category = 'frontend' | 'backend';

interface CategoryConfig {
  id: Category;
  label: string;
  title: string;
  titleColor: string;
  icon: React.ReactNode;
  description: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    title: 'Frontend',
    titleColor: 'text-indigo-400',
    icon: <FileCodeIcon className="size-4" />,
    description:
      'React 컴포넌트는 일반적으로 PascalCase를 사용하고, prop이나 함수 이름은 주로 camelCase를 사용합니다.',
  },
  {
    id: 'backend',
    label: 'Backend',
    title: 'Backend',
    titleColor: 'text-green-400',
    icon: <ServerIcon className="size-4" />,
    description:
      '백엔드에서는 언어 특성에 따라 camelCase 또는 snake_case를 사용하며, 클래스명은 PascalCase를 사용합니다.',
  },
];

export default function NamingConventionWidget2() {
  const [activeCategory, setActiveCategory] = useState<Category>('frontend');
  const [activeTip, setActiveTip] = useState<{
    category: string;
    desc: string;
  } | null>(null);

  // State 분리하는 게 나을까요?
  const [namingState, setNamingState] = useState<
    Pick<NamingConventionData, 'frontend' | 'backend'>
  >({
    frontend: {
      variable: 'camelCase' as NamingCase,
      function: 'camelCase' as NamingCase,
      component: 'PascalCase' as NamingCase,
      constant: 'UPPER_SNAKE_CASE' as NamingCase,
    },
    backend: {
      variable: 'camelCase' as NamingCase,
      function: 'camelCase' as NamingCase,
      class: 'PascalCase' as NamingCase,
      constant: 'UPPER_SNAKE_CASE' as NamingCase,
    },
  });

  const updateNamingState = (
    section: 'frontend' | 'backend',
    key: string,
    value: NamingCase,
  ) => {
    setNamingState((prev) => {
      const sectionState = prev[section];
      return {
        ...prev,
        [section]: {
          ...sectionState,
          [key]: value,
        },
      };
    });
  };

  const handleHover = (
    section: 'frontend' | 'backend',
    key: string,
    label: string,
  ) => {
    const sectionInfo = NAMING_INFO[section];
    const desc = sectionInfo[key as keyof typeof sectionInfo] || '';
    setActiveTip({ category: `${section.toUpperCase()} - ${label}`, desc });
  };

  const currentCategoryConfig = CATEGORIES.find(
    (cat) => cat.id === activeCategory,
  )!;
  const currentConvention =
    activeCategory === 'frontend' ? namingState.frontend : namingState.backend;

  return (
    <div className="flex h-full w-[400px] flex-col overflow-y-auto p-4">
      {/* Category Buttons */}
      <div className="mb-4 flex gap-2">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <Button
              key={category.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setActiveCategory(category.id);
                setActiveTip(null);
              }}
              className={`flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                  : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {category.icon}
              {category.label}
            </Button>
          );
        })}
      </div>

      {/* Configuration Section */}
      <div className="mb-4">
        <ConventionSection
          category={activeCategory}
          title={currentCategoryConfig.title}
          titleColor={currentCategoryConfig.titleColor}
          convention={currentConvention}
          onChange={(key, value) =>
            updateNamingState(activeCategory, key, value)
          }
          onHover={(key, label) => handleHover(activeCategory, key, label)}
        />
      </div>

      {/* Guideline Box */}
      <div className="mt-auto min-h-[100px]">
        {activeTip ? (
          <GuidelineBox
            category={activeTip.category}
            description={activeTip.desc}
          />
        ) : (
          <GuidelineBox
            category={`${currentCategoryConfig.label} Naming Strategy`}
            description={currentCategoryConfig.description}
          />
        )}
      </div>
    </div>
  );
}

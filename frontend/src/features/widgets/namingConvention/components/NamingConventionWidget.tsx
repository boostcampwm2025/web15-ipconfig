// frontend/src/features/widgets/namingConvention/NamingConventionWidget.tsx
import { useState } from 'react';
import { Button } from '@/common/components/shadcn/button';
import type {
  NamingConventionData,
  NamingCase,
} from '../types/namingConvention';
import { GuidelineBox } from '@/common/components/guidelineBox/GuidelineBox';
import { ConventionSection } from './ConventionSection';
import { NAMING_INFO } from '../constants/namingInfo';
import {
  FileCodeIcon,
  ServerIcon,
  DatabaseIcon,
  WrenchIcon,
} from 'lucide-react';
import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { RiFontSizeAi } from 'react-icons/ri';

type Category = 'frontend' | 'backend' | 'database' | 'common';

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
  {
    id: 'database',
    label: 'Database',
    title: 'Database',
    titleColor: 'text-blue-400',
    icon: <DatabaseIcon className="size-4" />,
    description:
      '데이터베이스에서는 테이블명과 컬럼명에 snake_case를 사용하며, 명확하고 일관된 네이밍을 유지합니다.',
  },
  {
    id: 'common',
    label: 'Common/Utils',
    title: 'Common/Utils',
    titleColor: 'text-purple-400',
    icon: <WrenchIcon className="size-4" />,
    description:
      '공통 유틸리티와 타입 정의는 camelCase 또는 PascalCase를 사용하며, 재사용 가능한 코드의 일관성을 유지합니다.',
  },
];

export default function NamingConventionWidget() {
  const [activeCategory, setActiveCategory] = useState<Category>('frontend');
  const [activeTip, setActiveTip] = useState<{
    category: string;
    desc: string;
  } | null>(null);

  // State 분리하는 게 나을까요?
  const [namingState, setNamingState] = useState<
    Pick<NamingConventionData, 'frontend' | 'backend' | 'database' | 'common'>
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
    database: {
      table: 'snake_case' as NamingCase,
      column: 'snake_case' as NamingCase,
      index: 'snake_case' as NamingCase,
      constraint: 'snake_case' as NamingCase,
    },
    common: {
      utility: 'camelCase' as NamingCase,
      constant: 'UPPER_SNAKE_CASE' as NamingCase,
      type: 'PascalCase' as NamingCase,
      enum: 'PascalCase' as NamingCase,
    },
  });

  const updateNamingState = (
    section: Category,
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

  const handleHover = (section: Category, key: string, label: string) => {
    const sectionInfo = NAMING_INFO[section];
    const desc = sectionInfo[key as keyof typeof sectionInfo] || '';
    setActiveTip({ category: `${section.toUpperCase()} - ${label}`, desc });
  };

  const currentCategoryConfig = CATEGORIES.find(
    (cat) => cat.id === activeCategory,
  )!;
  const currentConvention = namingState[activeCategory];

  return (
    <WidgetFrame
      title="네이밍 컨벤션"
      icon={<RiFontSizeAi className="text-white-500" />}
      defaultLayout={{ x: 200, y: 800 }}
    >
      <div className="flex h-full flex-col overflow-y-auto p-4">
        {/* Category Buttons */}
        <div className="mb-4 flex gap-2">
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <Button
                key={category.id}
                variant="default"
                size="sm"
                onClick={() => {
                  setActiveCategory(category.id);
                  setActiveTip(null);
                }}
                className={`flex items-center gap-2 border transition-all ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-md hover:border-indigo-700 hover:bg-indigo-700'
                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50'
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
    </WidgetFrame>
  );
}

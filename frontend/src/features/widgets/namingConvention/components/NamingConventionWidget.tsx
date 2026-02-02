import { useState } from 'react';
import { Button } from '@/common/components/shadcn/button';
import { GuidelineBox } from '@/common/components/guidelineBox/GuidelineBox';
import { ConventionSection } from './ConventionSection';
import { NAMING_INFO } from '../constants/namingInfo';
import useNamingConventionWidget from '../hooks/useNamingConventionWidget';

import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { RiFontSizeAi } from 'react-icons/ri';

import type { Category } from '../types/category';
import { CATEGORIES } from '../constants/category';

export default function NamingConventionWidget() {
  const [activeCategory, setActiveCategory] = useState<Category>('frontend');
  const [activeTip, setActiveTip] = useState<{
    category: string;
    desc: string;
  } | null>(null);

  const { handleUpdate, currentConvention } =
    useNamingConventionWidget(activeCategory);

  const handleHover = (section: Category, key: string, label: string) => {
    const sectionInfo = NAMING_INFO[section];
    const desc = sectionInfo[key as keyof typeof sectionInfo] || '';
    setActiveTip({ category: `${section.toUpperCase()} - ${label}`, desc });
  };

  const currentCategoryConfig = CATEGORIES.find(
    (cat) => cat.id === activeCategory,
  )!;

  return (
    <WidgetFrame
      title="네이밍 컨벤션"
      icon={<RiFontSizeAi className="text-white-500" />}
    >
      <div className="flex h-full w-[500px] flex-col overflow-y-auto p-4">
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
            onChange={(key, value) => handleUpdate(activeCategory, key, value)}
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

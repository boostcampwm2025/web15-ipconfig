// frontend/src/features/widgets/namingConvention/NamingConventionWidget.tsx
import { useState } from 'react';
import { Separator } from '@/common/components/shadcn/separator';
import type {
  NamingConventionData,
  NamingCase,
} from '../types/namingConvention';
import { GuidelineBox } from './GuidelineBox';
import { ConventionSection } from './ConventionSection';
import { NAMING_INFO } from '../constants/namingInfo';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';

export default function NamingConventionWidget() {
  const { widgetId } = useWidgetIdAndType();
  const widgetData = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  );

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

  const handleHover = (section: 'frontend' | 'backend', key: string) => {
    const sectionInfo = NAMING_INFO[section];
    const desc = sectionInfo[key as keyof typeof sectionInfo] || '';
    setActiveTip({ category: `${section.toUpperCase()} - ${key}`, desc });
  };

  return (
    <div className="flex h-full w-[400px] flex-col overflow-y-auto p-4">
      <ConventionSection
        category="frontend"
        title="Frontend"
        titleColor="text-indigo-400"
        convention={namingState.frontend}
        onChange={(key, value) => updateNamingState('frontend', key, value)}
        onHover={(key) => handleHover('frontend', key)}
      />
      <Separator className="my-2 bg-gray-700" />
      <ConventionSection
        category="backend"
        title="Backend"
        titleColor="text-green-400"
        convention={namingState.backend}
        onChange={(key, value) => updateNamingState('backend', key, value)}
        onHover={(key) => handleHover('backend', key)}
      />
      <div className="mt-auto min-h-[100px]">
        {activeTip ? (
          <GuidelineBox
            category={activeTip.category}
            description={activeTip.desc}
          />
        ) : (
          <div className="mt-4 rounded-md border border-dashed border-gray-700 p-4 text-center text-sm text-gray-500 italic">
            Hover over an item to see naming tips.
          </div>
        )}
      </div>
    </div>
  );
}

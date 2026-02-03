import { FRAMEWORKS } from '../constants/frameworks';
import type { FrameworkOption } from '../types/wizard';
import { Button } from '@/common/components/shadcn/button';

interface FrameworkSelectorProps {
  selectedId: FrameworkOption['id'] | null;
  onSelect: (frameworkId: FrameworkOption['id']) => void;
}

export function FrameworkSelector({
  selectedId,
  onSelect,
}: FrameworkSelectorProps) {
  return (
    <div className="mb-4 flex gap-2">
      {FRAMEWORKS.map((fw) => {
        const isActive = selectedId === fw.id;
        return (
          <Button
            key={fw.id}
            variant="default"
            size="sm"
            onClick={() => onSelect(fw.id)}
            className={`flex items-center gap-2 border transition-all ${
              isActive
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-md hover:border-indigo-700 hover:bg-indigo-700'
                : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50'
            }`}
          >
            <fw.icon className="size-4" />
            {fw.label}
          </Button>
        );
      })}
    </div>
  );
}

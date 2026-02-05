import { memo, useMemo } from 'react';
import NoContents from './NoContents';
import { TECH_STACK_GROUPS } from '@/features/widgets/techStack/constant/techStackInfo';
import DraggableTechStackItem from './DraggableTechStackItem';
import { ALL_TECH_STACKS } from '@/features/widgets/techStack/constant/techStackInfo';

interface TechStackListProps {
  keyword: string;
}

function TechStackList({ keyword }: TechStackListProps) {
  const filteredStacks = useMemo(() => {
    const lower = keyword.toLowerCase();
    return ALL_TECH_STACKS.filter((item) =>
      item.name.toLowerCase().includes(lower),
    );
  }, [keyword]);

  if (filteredStacks.length === 0) {
    return <NoContents />;
  }

  return (
    <div className="flex flex-wrap gap-2.5 overflow-y-auto py-1">
      {filteredStacks.map((tech) => (
        <DraggableTechStackItem key={tech.id} {...tech} />
      ))}
    </div>
  );
}

export default memo(TechStackList);

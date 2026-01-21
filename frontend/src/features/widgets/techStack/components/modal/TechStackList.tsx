import { memo, useMemo } from 'react';
import NoContents from './NoContents';
import { TECH_STACKS } from '@/features/widgets/techStack/constant/techStackInfo';
import DraggableTechStackItem from './DraggableTechStackItem';

interface TechStackListProps {
  keyword: string;
}

function TechStackList({ keyword }: TechStackListProps) {
  const filteredStacks = useMemo(() => {
    const lower = keyword.toLowerCase();
    return TECH_STACKS.filter((tech) =>
      tech.name.toLowerCase().includes(lower),
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

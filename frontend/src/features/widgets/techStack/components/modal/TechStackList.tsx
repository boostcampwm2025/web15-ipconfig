import { memo, useMemo } from 'react';
import NoContents from './NoContents';
import { TECH_STACKS } from '../../constant/techStackInfo';
import DraggableTechStackItem from './DraggableTechStackItem';

interface TechStackListProps {
  keyword: string;
}

function TechStackList({ keyword }: TechStackListProps) {
  const filteredStacks = useMemo(() => {
    const lower = keyword.toLowerCase();
    return TECH_STACKS.filter((te) => te.name.toLowerCase().includes(lower));
  }, [keyword]);

  if (filteredStacks.length === 0) {
    return <NoContents />;
  }

  return (
    <div className="flex flex-wrap gap-2 overflow-y-auto">
      {filteredStacks.map((te) => (
        <DraggableTechStackItem key={te.name} techName={te.name} />
      ))}
    </div>
  );
}

export default memo(TechStackList);

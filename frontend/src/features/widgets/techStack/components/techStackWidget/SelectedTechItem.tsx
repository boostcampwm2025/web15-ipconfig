import { LuX } from 'react-icons/lu';
import TechStackItem from '@/features/widgets/techStack/components/TechStackItem';
import { Button } from '@/common/components/shadcn/button';

interface SelectedTechItemProps {
  name: string;
  slug: string;
  color: string;
  onRemove: () => void;
}

// 선택된 기술 스택 아이템 컴포넌트
function SelectedTechItem({
  name,
  slug,
  color,
  onRemove,
}: SelectedTechItemProps) {
  return (
    <div className="group relative flex flex-col items-center justify-center gap-2">
      <Button
        size="icon"
        onClick={onRemove}
        className="bg-destructive text-destructive-foreground hover:bg-destructive hover:text-destructive-foreground absolute -top-2 -right-2 hidden size-5 cursor-pointer rounded-full group-hover:flex"
      >
        <LuX className="size-3" color="white" />
      </Button>
      <TechStackItem name={name} slug={slug} color={color} />
    </div>
  );
}

export default SelectedTechItem;

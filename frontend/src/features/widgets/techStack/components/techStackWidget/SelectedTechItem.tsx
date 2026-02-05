import { LuX } from 'react-icons/lu';
import TechStackItem from '@/features/widgets/techStack/components/TechStackItem';
import { Button } from '@/common/components/shadcn/button';

interface SelectedTechItemProps {
  name: string;
  onRemove: () => void;
}

// 선택된 기술 스택 아이템 컴포넌트
function SelectedTechItem({ name, onRemove }: SelectedTechItemProps) {
  return (
    <div className="group border-border bg-secondary/20 relative flex flex-col items-center justify-center gap-2 rounded-lg border">
      <Button
        onClick={onRemove}
        className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 hidden cursor-pointer rounded-full p-1 group-hover:block"
      >
        <LuX size={12} />
      </Button>

      <TechStackItem techName={name} />
    </div>
  );
}

export default SelectedTechItem;

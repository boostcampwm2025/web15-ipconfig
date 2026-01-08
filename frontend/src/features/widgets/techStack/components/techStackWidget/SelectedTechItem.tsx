import { LuX } from 'react-icons/lu';
import TechStackItem from '@/features/widgets/techStack/components/TechStackItem';

interface SelectedTechItemProps {
  name: string;
  onRemove: () => void;
}

// 선택된 기술 스택 아이템 컴포넌트
function SelectedTechItem({ name, onRemove }: SelectedTechItemProps) {
  return (
    <div className="group borde relative flex flex-col items-center justify-center gap-2 rounded-lg">
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 hidden cursor-pointer rounded-full bg-red-500 p-1 text-white group-hover:block"
      >
        <LuX size={12} />
      </button>

      <TechStackItem techName={name} />
    </div>
  );
}

export default SelectedTechItem;

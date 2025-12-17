import { LuLayers, LuTrash2 } from 'react-icons/lu';
import SearchBar from './SearchBar';
import TechLabel from './TeckLabel';
import { TECH_STACKS } from '../constant/techStackInfo';

export default function TechStackModal() {
  return (
    <div className="w-[400px] cursor-auto rounded-xl border border-gray-700 bg-gray-800 p-5">
      <WidgetHeader
        title="Tech Stack"
        icon={<LuLayers className="text-purple-400" size={18} />}
        onRemove={() => {}}
      />
      <SearchBar />
      <div className="flex flex-wrap gap-2">
        {TECH_STACKS.map((te) => (
          <TechLabel key={te.name} techName={te.name} />
        ))}
      </div>
    </div>
  );
}

interface WidgetHeaderProps {
  title: string;
  icon: React.ReactNode;
  onRemove: () => void;
}
const WidgetHeader = ({ title, icon, onRemove }: WidgetHeaderProps) => (
  <div className="mb-4 flex items-center justify-between border-b border-gray-700 pb-2 select-none">
    <h4 className="flex items-center gap-2 font-bold text-white">
      {icon} {title}
    </h4>
    <button
      onMouseDown={(e) => e.stopPropagation()}
      onClick={onRemove}
      className="text-gray-500 transition-colors hover:text-red-400"
    >
      <LuTrash2 size={16} />
    </button>
  </div>
);

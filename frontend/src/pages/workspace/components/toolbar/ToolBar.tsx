import ToolButton from './ToolButton';
import { LuMousePointer2 } from 'react-icons/lu';
import { LuLayers } from 'react-icons/lu';

function ToolBar() {
  return (
    <div className="fixed top-1/2 left-6 z-50 flex -translate-y-1/2 flex-col gap-2 rounded-2xl border border-gray-700 bg-gray-800 p-2 shadow-2xl backdrop-blur-xl transition-all hover:scale-105">
      <div className="flex flex-col items-center justify-center gap-4">
        <ToolButton
          icon={<LuMousePointer2 size={20} />}
          label="Select"
          active
        />

        <div className="h-px w-8 bg-gray-700" />

        <ToolButton icon={<LuLayers size={20} />} label="기술 스택" />
      </div>
    </div>
  );
}

export default ToolBar;

import { LuZoomIn, LuZoomOut } from 'react-icons/lu';

function ZoomControls() {
  return (
    <div className="absolute bottom-6 left-6 z-50 flex items-center gap-2">
      <div className="flex items-center rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
        <button className="flex h-8 w-8 items-center justify-center rounded-l-lg border-r border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white">
          <LuZoomOut size={14} />
        </button>
        <span className="px-2 font-mono text-xs text-gray-300">100%</span>
        <button className="flex h-8 w-8 items-center justify-center rounded-r-lg text-gray-400 hover:bg-gray-700 hover:text-white">
          <LuZoomIn size={14} />
        </button>
      </div>
    </div>
  );
}

export default ZoomControls;

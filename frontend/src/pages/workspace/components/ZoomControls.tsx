import type { Camera } from '@/common/types/camera';
import { ZOOM_CONFIG } from '@/features/canvas/constants/zoom';
import { LuZoomIn, LuZoomOut } from 'react-icons/lu';

interface ZoomControlsProps {
  handleZoomButton: (delta: number) => void;
  camera: Camera;
}

function ZoomControls({ handleZoomButton, camera }: ZoomControlsProps) {
  const isMaxZoom = camera.scale >= ZOOM_CONFIG.MAX_ZOOM;
  const isMinZoom = camera.scale <= ZOOM_CONFIG.MIN_ZOOM;

  return (
    <div className="absolute bottom-6 left-6 z-50 flex items-center gap-2">
      <div className="flex items-center rounded-lg border border-gray-700 bg-gray-800 shadow-lg">
        <button
          disabled={isMinZoom}
          className="flex h-8 w-8 items-center justify-center rounded-l-lg border-r border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
          onClick={() => handleZoomButton(-ZOOM_CONFIG.ZOOM_BUTTON_STEP)}
        >
          <LuZoomOut size={14} />
        </button>
        <span className="px-2 font-mono text-xs text-gray-300">
          {Math.floor(camera.scale * 100)}%
        </span>
        <button
          disabled={isMaxZoom}
          className="flex h-8 w-8 items-center justify-center rounded-r-lg text-gray-400 hover:bg-gray-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
          onClick={() => handleZoomButton(ZOOM_CONFIG.ZOOM_BUTTON_STEP)}
        >
          <LuZoomIn size={14} />
        </button>
      </div>
    </div>
  );
}

export default ZoomControls;

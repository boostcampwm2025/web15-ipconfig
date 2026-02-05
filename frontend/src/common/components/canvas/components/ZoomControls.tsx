import { ZOOM_CONFIG } from '@/common/components/canvas/constants/zoom';
import { LuZoomIn, LuZoomOut } from 'react-icons/lu';
import { useCanvas } from '../context/CanvasProvider';
import { zoomByDeltaAtPivot } from '../lib/positionTransform';

import { Button } from '@/common/components/shadcn/button';

function ZoomControls() {
  const { camera, setCamera, getFrameInfo } = useCanvas();
  const isMaxZoom = camera.scale >= ZOOM_CONFIG.MAX_ZOOM;
  const isMinZoom = camera.scale <= ZOOM_CONFIG.MIN_ZOOM;

  const handleZoomButton = (delta: number) => {
    const { width, height } = getFrameInfo();

    const pivot = { x: width / 2, y: height / 2 };
    setCamera((prev) => zoomByDeltaAtPivot(delta, pivot, prev));
  };

  return (
    <div
      id="zoom-controls"
      className="absolute bottom-6 left-6 z-50 flex items-center gap-2"
    >
      <div className="border-border bg-popover/80 flex items-center rounded-lg border p-0.5 shadow-lg backdrop-blur-xl">
        <Button
          variant="ghost"
          size="icon"
          disabled={isMinZoom}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-r-none disabled:opacity-50"
          onClick={() => handleZoomButton(-ZOOM_CONFIG.ZOOM_BUTTON_STEP)}
        >
          <LuZoomOut size={14} />
        </Button>
        <span className="text-muted-foreground w-12 text-center font-mono text-xs">
          {Math.floor(camera.scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          disabled={isMaxZoom}
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-l-none disabled:opacity-50"
          onClick={() => handleZoomButton(ZOOM_CONFIG.ZOOM_BUTTON_STEP)}
        >
          <LuZoomIn size={14} />
        </Button>
      </div>
    </div>
  );
}

export default ZoomControls;

import { useCallback, useEffect } from 'react';

import { useCanvas } from '../context/CanvasProvider';
import { ZOOM_CONFIG } from '../constants/zoom';
import { zoomByDeltaAtPivot } from '../lib/positionTransform';

function useWheel() {
  const { setCamera, frameRef, getFrameInfo } = useCanvas();
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();

        const { left: rectLeft, top: rectTop } = getFrameInfo();

        const pivotPosition = {
          x: e.clientX - rectLeft,
          y: e.clientY - rectTop,
        };

        const zoomDelta = -e.deltaY * ZOOM_CONFIG.WHEEL_SENSITIVITY;
        setCamera((prev) => zoomByDeltaAtPivot(zoomDelta, pivotPosition, prev));
      }
    },
    [getFrameInfo, setCamera],
  );

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    frame.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      frame.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel, frameRef]);
}

export default useWheel;

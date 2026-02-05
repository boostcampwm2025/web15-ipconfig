import {
  clearUserChatMessage,
  updateLocalCursor,
} from '@/common/api/yjs/awareness';
import {
  browserToCanvasPosition,
  getNewCameraState,
} from '../lib/positionTransform';
import { useThrottledCallback } from '@/common/hooks/useThrottledCallback';
import { useCallback, useRef, useState } from 'react';
import type { Position } from '@/common/types/canvas';
import { useCanvas } from '../context/CanvasProvider';

function usePanning() {
  const { camera, setCamera, getFrameInfo } = useCanvas();
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef<Position | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPanning(true);
    clearUserChatMessage();
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!lastMousePos.current) return;

      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // 패닝 하는 경우
      if (isPanning) {
        setCamera((prev) => ({
          ...prev,
          ...getNewCameraState(prev, { dx, dy }),
        }));
      }
    },
    [isPanning, setCamera],
  );

  const handlePointerUp = () => {
    setIsPanning(false);
    lastMousePos.current = null;
  };

  const handleMouseMove = useThrottledCallback((e: React.MouseEvent) => {
    const frameInfo = getFrameInfo();
    const canvasPosition = browserToCanvasPosition(
      { x: e.clientX, y: e.clientY },
      { x: frameInfo.left, y: frameInfo.top },
      camera,
    );

    updateLocalCursor(canvasPosition.x, canvasPosition.y);
  }, 50);

  return {
    isPanning,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleMouseMove,
  };
}

export default usePanning;

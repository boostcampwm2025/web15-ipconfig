import type { Position } from '@/common/types/canvas';
import { useCanvas } from '../context/CanvasProvider';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { ZOOM_CONFIG } from '../constants/zoom';
import {
  getNewCameraState,
  zoomByDeltaAtPivot,
  browserToCanvasPosition,
} from '../lib/positionTransform';
import { cn } from '@/common/lib/utils';
import { updateLocalCursor } from '@/common/api/yjs/awareness';
import { useThrottledCallback } from '@/common/hooks/useThrottledCallback';

export function CanvasWrapper({ children }: PropsWithChildren) {
  const { camera, setCamera, frameRef, getFrameInfo } = useCanvas();
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef<Position | null>(null);

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

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPanning(true);
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

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    frame.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      frame.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel, frameRef]);

  return (
    // 뷰포트 레이어
    <div
      ref={frameRef}
      className={cn(
        'relative h-full w-full touch-none overflow-hidden bg-gray-900 select-none',
        isPanning && 'cursor-grabbing',
      )}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onMouseMove={handleMouseMove}
    >
      {/* 캔버스 이동 이벤트 감지용 */}
      <div
        onPointerDown={handlePointerDown}
        className={cn(
          'absolute inset-0 h-full w-full touch-none',
          isPanning && 'cursor-grabbing',
        )}
      />
      {/* 캔버스 좌표계의 원점 컨테이너 */}
      <div
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
          transformOrigin: '0 0',
        }}
        className="pointer-events-none absolute top-0 left-0 h-0 w-0 overflow-visible"
      >
        {children}
      </div>
    </div>
  );
}

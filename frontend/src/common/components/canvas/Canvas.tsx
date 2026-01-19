import type { Cursors } from '@/common/types/cursor';
import type { Widgets } from '@/common/types/widgetData';
import { cn } from '@/common/lib/utils';
import CursorLayer from '@/common/components/cursor/CursorLayer';
import WidgetLayer from '../widgetFrame/WidgetLayer';
import { CanvasProvider, useCanvas } from './context/CanvasProvider';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Position } from '@/common/types/canvas';
import {
  browserToCanvasPosition,
  getNewCameraState,
  zoomByDeltaAtPivot,
} from './lib/positionTransform';
import ZoomControls from './components/ZoomControls';
import { ZOOM_CONFIG } from './constants/zoom';

interface CanvasProps {
  remoteCursors: Cursors;
  widgets: Widgets;
}

function CanvasContent({ remoteCursors, widgets }: CanvasProps) {
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

  const handlePointerMove = (e: React.PointerEvent) => {
    // TODO: 쓰로틀링 적용하기
    if (!lastMousePos.current) return;

    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      setCamera((prev) => ({
        ...prev,
        ...getNewCameraState(prev, { dx, dy }),
      }));
    }

    const mousePositionInCanvas = getMousePosition(e);

    ///emitCursorMove(mousePositionInCanvas.x, mousePositionInCanvas.y);
  };

  const handlePointerUp = () => {
    setIsPanning(false);
    lastMousePos.current = null;
  };

  // 캔버스 좌표로 변환
  const getMousePosition = (e: React.PointerEvent | React.MouseEvent) => {
    const { left: rectLeft, top: rectTop } = getFrameInfo();
    const frameLeftTopPosition = { x: rectLeft, y: rectTop };

    const mousePositionInCanvas = browserToCanvasPosition(
      { x: e.clientX, y: e.clientY },
      frameLeftTopPosition,
      camera,
    );

    return mousePositionInCanvas;
  };

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
        <WidgetLayer widgets={widgets} />
        {/* 커서 렌더링 */}
        <CursorLayer remoteCursors={remoteCursors} />
      </div>
    </div>
  );
}

function Canvas({ remoteCursors, widgets }: CanvasProps) {
  return (
    <CanvasProvider>
      <CanvasContent remoteCursors={remoteCursors} widgets={widgets} />
      <ZoomControls />
    </CanvasProvider>
  );
}

export default Canvas;

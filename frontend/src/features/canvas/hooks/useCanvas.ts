import type { Camera } from '@/common/types/camera';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ZOOM_CONFIG } from '../constants/zoom';

import { CANVAS_CONFIG } from '../constants/canvas';
import { getPositionInCanvas } from '@/common/lib/canvas';

export default function useCanvas() {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const zoomTo = useCallback(
    (delta: number, pivotX: number, pivotY: number) => {
      setCamera((prev) => {
        const newScale = Math.min(
          Math.max(prev.scale + delta, ZOOM_CONFIG.MIN_ZOOM),
          ZOOM_CONFIG.MAX_ZOOM,
        );

        if (newScale === prev.scale) return prev;

        const ratio = newScale / prev.scale;
        const newX = pivotX - (pivotX - prev.x) * ratio;
        const newY = pivotY - (pivotY - prev.y) * ratio;

        return { x: newX, y: newY, scale: newScale };
      });
    },
    [],
  );

  const handleZoomButton = (delta: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    zoomTo(delta, centerX, centerY);
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomDelta = -e.deltaY * ZOOM_CONFIG.WHEEL_SENSITIVITY;

        zoomTo(zoomDelta, mouseX, mouseY);
      }
    },
    [zoomTo],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPanning(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!lastMousePos.current) return;

    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    if (isPanning) {
      setCamera((prev) => ({
        ...prev,
        x: Math.min(
          Math.max(prev.x + dx, CANVAS_CONFIG.MIN_X),
          CANVAS_CONFIG.MAX_X,
        ),
        y: Math.min(
          Math.max(prev.y + dy, CANVAS_CONFIG.MIN_Y),
          CANVAS_CONFIG.MAX_Y,
        ),
      }));
    }
  };

  const handlePointerUp = () => {
    setIsPanning(false);
    lastMousePos.current = null;
  };

  // World 좌표로 변환
  const getMousePosition = (e: React.PointerEvent | React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();

    // 1단계: 뷰포트 기준 마우스 좌표
    const mouseXInViewport = e.clientX;
    const mouseYInViewport = e.clientY;
    const mousePoint = { x: mouseXInViewport, y: mouseYInViewport };

    // 2단계: 캔버스 컨테이너 기준 마우스 좌표
    const containerPoint = { x: rect.left, y: rect.top };

    const mousePosition = getPositionInCanvas(
      mousePoint,
      containerPoint,
      camera,
    );

    return mousePosition;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  return {
    camera,
    handleZoomButton,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isPanning,
    containerRef,
    getMousePosition,
  };
}

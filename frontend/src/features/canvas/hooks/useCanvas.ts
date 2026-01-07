import type { Camera } from '@/common/types/camera';
import type { WidgetData } from '@/common/types/widgetData';
import { useRef, useState } from 'react';

export default function useCanvas() {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, z: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [widgets, setWidgets] = useState<WidgetData[]>([
    {
      id: 'w1',
      type: 'tech',
      content: 'Tech Stack',
      position: { x: 200, y: 200 },
      width: 300,
      height: 500,
    },
  ]);
  const [draggingWidgetId, setDraggingWidgetId] = useState<string | null>(null);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomButton = (delta: number) => {
    setCamera((prev) => {
      const newZoom = Math.min(Math.max(prev.z + delta, 0.1), 5);
      const container = containerRef.current;
      if (!container) return { ...prev, z: newZoom };

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // 중앙점이 도망가지 않게 잡아당기는 계산
      const newX = centerX - (centerX - prev.x) * (newZoom / prev.z);
      const newY = centerY - (centerY - prev.y) * (newZoom / prev.z);

      return { x: newX, y: newY, z: newZoom };
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;

    // 위젯을 클릭한 경우 -> 위젯 드래그 시작
    const widgetElement = target.closest('[data-widget-id]');
    if (widgetElement) {
      const widgetId = widgetElement.getAttribute('data-widget-id');
      setDraggingWidgetId(widgetId);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      e.stopPropagation();
      return;
    }

    setIsPanning(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!lastMousePos.current) return;

    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    if (isPanning) {
      setCamera((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }

    if (draggingWidgetId) {
      const worldDx = dx / camera.z;
      const worldDy = dy / camera.z;

      setWidgets((prev) =>
        prev.map((w) => {
          if (w.id === draggingWidgetId) {
            const newWidget = {
              ...w,
              position: {
                x: w.position.x + worldDx,
                y: w.position.y + worldDy,
              },
            };
            // [공동 편집 포인트]: 여기서 newWidget 정보를 소켓으로 전송하면 됨
            // socket.emit('update-widget', newWidget);
            return newWidget;
          }
          return w;
        }),
      );
    }
  };

  const handlePointerUp = () => {
    setIsPanning(false);
    setDraggingWidgetId(null);
    lastMousePos.current = null;
  };

  // World 좌표로 변환
  const getMousePosition = (e: React.PointerEvent | React.MouseEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();

    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;

    const worldX = (canvasX - camera.x) / camera.z;
    const worldY = (canvasY - camera.y) / camera.z;

    return { x: worldX, y: worldY };
  };

  return {
    camera,
    handleZoomButton,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isPanning,
    containerRef,
    getMousePosition,
    widgets,
  };
}

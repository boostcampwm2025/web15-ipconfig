import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useWidgetIdAndType } from './context/WidgetContext';
import { emitUpdateWidgetLayout } from '@/common/api/socket';
import { useCanvas } from '../canvas/context/CanvasProvider';
import type { WidgetLayout } from '@/common/types/widgetData';

interface WidgetContainerProps {
  children: React.ReactNode;
  defaultLayout?: WidgetLayout;
}

function WidgetContainer({ children, defaultLayout }: WidgetContainerProps) {
  const { widgetId } = useWidgetIdAndType();
  const { camera } = useCanvas();
  const widgetData = useWorkspaceWidgetStore((state) =>
    state.widgetList.find((widget) => widget.widgetId === widgetId),
  );

  const { x, y, width, height, zIndex } = widgetData?.layout ??
    defaultLayout ?? {
      x: 400,
      y: 400,
    };

  // 드래그 시작 시점의 데이터 저장
  const dragStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    widgetX: 0,
    widgetY: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

  // 스로틀링을 위한 ref
  const lastEmitRef = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // 헤더 영역이 아닌 곳에서는 드래그 시작하지 않음
    const target = e.target as HTMLElement;
    const isHeader = target.closest('[data-widget-header="true"]');
    if (!isHeader) return;

    // 캔버스 패닝으로 이벤트가 전파되지 않도록 중단
    e.stopPropagation();
    e.preventDefault();

    setIsDragging(true);

    // 시작 시점의 위치 정보 저장
    dragStartRef.current = {
      mouseX: e.clientX, // 현재 브라우저에서 마우스 좌표
      mouseY: e.clientY, // 현재 브라우저에서 마우스 좌표
      widgetX: x, // 현재 위젯 위치
      widgetY: y, // 현재 위젯 위치
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();

      const { mouseX, mouseY, widgetX, widgetY } = dragStartRef.current;

      // 마우스 이동 거리 계산 (scale 보정)
      const deltaX = (e.clientX - mouseX) / camera.scale;
      const deltaY = (e.clientY - mouseY) / camera.scale;

      // 실제 위젯 위치 계산
      const actualX = widgetX + deltaX;
      const actualY = widgetY + deltaY;

      // 스로틀링으로 이벤트 전송
      const now = performance.now();
      if (now - lastEmitRef.current < 30) return;
      lastEmitRef.current = now;

      emitUpdateWidgetLayout(widgetId, { x: actualX, y: actualY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, widgetId, camera.scale]);

  return (
    <div
      className="pointer-events-auto absolute w-fit rounded-xl border border-gray-700 bg-gray-800"
      style={{
        left: x,
        top: y,
        width: width ?? 'auto',
        height: height ?? 'auto',
        zIndex: zIndex ?? 1,
      }}
      onPointerDown={handlePointerDown}
    >
      <div className="cursor-auto rounded-xl p-5">{children}</div>
    </div>
  );
}

export default WidgetContainer;

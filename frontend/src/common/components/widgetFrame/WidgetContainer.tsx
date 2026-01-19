import { useEffect, useState, useRef } from 'react';
import type React from 'react';
import type { ComponentProps } from 'react';
import type { MoveWidgetData, WidgetContent } from '@/common/types/widgetData';

interface WidgetContainerProps extends Omit<ComponentProps<'div'>, 'content'> {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex?: number;
  content?: WidgetContent;
  emitMoveWidget?: (widgetId: string, data: MoveWidgetData) => void;
}

function WidgetContainer({
  children,
  id,
  x,
  y,
  width,
  height,
  zIndex,
  emitMoveWidget,
}: WidgetContainerProps) {
  // 드래그 중 로컬 위치 상태 (즉시 UI 업데이트용)
  const [localPosition, setLocalPosition] = useState({ x, y });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // 스로틀링을 위한 ref (커서처럼)
  const lastEmitRef = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // 헤더 영역이 아닌 곳에서는 드래그 시작하지 않음
    const target = e.target as HTMLElement;
    // 헤더 영역임을 구분할 수 있는 방법이 따로 있을까? 만약 헤더 CSS 속성이 변한다면...
    const isHeader = target.closest('[data-widget-header="true"]');
    if (!isHeader) return;

    // 캔버스 패닝으로 이벤트가 전파되지 않도록 중단
    e.stopPropagation();
    e.preventDefault();

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - x,
      y: e.clientY - y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();

      // 실제 받는 x, y 위치 계산 (캔버스 좌표계)
      const actualX = e.clientX - dragOffset.x;
      const actualY = e.clientY - dragOffset.y;

      // 즉시 UI 업데이트
      setLocalPosition({
        x: actualX,
        y: actualY,
      });

      // 스로틀링으로 이벤트 전송 (커서처럼)
      const now = performance.now();
      if (now - lastEmitRef.current < 30) return;
      lastEmitRef.current = now;

      if (emitMoveWidget) {
        emitMoveWidget(id, {
          x: actualX,
          y: actualY,
        });
      }
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
  }, [isDragging, dragOffset, emitMoveWidget, id]);

  // 화면에 그릴 위치: 드래그 중이면 로컬 상태, 아니면 서버에서 받은 실제 위치 사용
  const displayPosition = isDragging ? localPosition : { x, y };

  return (
    <div
      className="animate-pop-in pointer-events-auto absolute rounded-xl shadow-2xl"
      style={{
        left: displayPosition.x,
        top: displayPosition.y,
        minWidth: width ?? 'auto',
        minHeight: height ?? 'auto',
        zIndex: zIndex ?? 1,
      }}
      onPointerDown={handlePointerDown}
    >
      <div className="cursor-auto rounded-xl border border-gray-700 bg-gray-800 p-5">
        {children}
      </div>
    </div>
  );
}

export default WidgetContainer;

import { useEffect, useState, useRef } from 'react';
import type React from 'react';
import type { ComponentProps } from 'react';
import type { MoveWidgetData, WidgetContent } from '@/common/types/widgetData';
import { useCanvasScale } from '@/features/canvas/context/CanvasContext';

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
  const scale = useCanvasScale();
  // 드래그 중 로컬 위치 상태 (즉시 UI 업데이트용)
  const [localPosition, setLocalPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);

  // 드래그 시작 시점의 데이터 저장 (Ref로 관리하여 클로저 문제 해결)
  const dragStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    widgetX: 0,
    widgetY: 0,
  });

  // 스로틀링을 위한 ref (커서처럼)
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
      mouseX: e.clientX,
      mouseY: e.clientY,
      widgetX: x, // props로 전달받은 현재 위젯 위치 (서버 동기화된 위치)
      widgetY: y,
    };

    // 로컬 포지션 초기화 (혹시 모를 오차 방지)
    setLocalPosition({ x, y });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();

      const { mouseX, mouseY, widgetX, widgetY } = dragStartRef.current;

      // 마우스 이동 거리 계산 (scale 보정)
      const deltaX = (e.clientX - mouseX) / scale;
      const deltaY = (e.clientY - mouseY) / scale;

      // 실제 위젯 위치 계산
      const actualX = widgetX + deltaX;
      const actualY = widgetY + deltaY;

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
  }, [isDragging, emitMoveWidget, id, scale]);

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

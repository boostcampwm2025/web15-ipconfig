import { useEffect, useState } from 'react';
import type React from 'react';
import type { ComponentProps } from 'react';
import type { WidgetContent } from '@/common/types/widgetData';

interface WidgetContainerProps extends Omit<ComponentProps<'div'>, 'content'> {
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex?: number;
  content?: WidgetContent;
}

function WidgetContainer({
  children,
  x,
  y,
  width,
  height,
  zIndex,
}: WidgetContainerProps) {
  // 로컬 드래그 위치 상태 (소켓/서버와는 독립적으로 동작)
  const [position, setPosition] = useState({ x, y });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // 헤더 영역이 아닌 곳에서는 드래그 시작하지 않음
    const target = e.target as HTMLElement;
    const isHeader = target.closest('[data-widget-header="true"]');
    if (!isHeader) return;

    // 캔버스 패닝으로 이벤트가 전파되지 않도록 중단
    e.stopPropagation();
    e.preventDefault();

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
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
  }, [isDragging, dragOffset]);

  return (
    <div
      className="animate-pop-in absolute rounded-xl shadow-2xl"
      style={{
        left: position.x,
        top: position.y,
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

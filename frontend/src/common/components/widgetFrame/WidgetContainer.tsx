import { useEffect, useState } from 'react';
import type React from 'react';
import type { PropsWithChildren } from 'react';
import { useWidgetFrame } from './WidgetFrame';

function WidgetContainer({ children }: PropsWithChildren) {
  const { widgetId, type, layout } = useWidgetFrame();
  const { x, y, width, height, zIndex } = layout;

  // 드래그 중 로컬 위치 상태 (즉시 UI 업데이트용)
  const [localPosition, setLocalPosition] = useState({ x, y });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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
  }, [isDragging, dragOffset, widgetId]);

  // 화면에 그릴 위치: 드래그 중이면 로컬 상태, 아니면 서버에서 받은 실제 위치 사용
  const displayPosition = isDragging ? localPosition : { x, y };

  return (
    <div
      className="animate-pop-in pointer-events-auto absolute w-fit rounded-xl shadow-2xl"
      style={{
        left: displayPosition.x,
        top: displayPosition.y,
        width: width ?? 'auto',
        height: height ?? 'auto',
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

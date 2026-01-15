import { useState } from 'react';
import type { ComponentProps } from 'react';
import type { WidgetContent } from '@/common/types/widgetData';

interface WidgetContainerProps extends Omit<ComponentProps<'div'>, 'content'> {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex?: number;
  content?: WidgetContent;
}

function WidgetContainer({
  children,
  id,
  x,
  y,
  width,
  height,
  zIndex,
  content,
}: WidgetContainerProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (
    e: React.MouseEvent,
    id: string,
    x: number,
    y: number,
  ) => {
    setDraggingId(id);
    setDragOffset({
      x: e.clientX - x,
      y: e.clientY - y,
    });
  };

  return (
    <div
      className="animate-pop-in pointer-events-auto absolute rounded-xl shadow-2xl"
      style={{
        left: x,
        top: y,
        minWidth: width ?? 'auto',
        minHeight: height ?? 'auto',
        zIndex: zIndex ?? 1,
      }}
      onMouseDown={(e) => handleMouseDown(e, id, x, y)}
    >
      <div className="cursor-auto rounded-xl border border-gray-700 bg-gray-800 p-5">
        {children}
      </div>
    </div>
  );
}

export default WidgetContainer;

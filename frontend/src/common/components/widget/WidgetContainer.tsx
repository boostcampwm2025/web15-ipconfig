import type { WidgetData } from '@/common/types/widgetData';

import { useState } from 'react';
import type { ComponentProps } from 'react';

function WidgetContainer({
  children,
  position,
  id,
  width,
  height,
}: ComponentProps<'div'> & WidgetData) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (
    e: React.MouseEvent,
    id: string,
    x: number,
    y: number,
  ) => {
    e.stopPropagation(); // Prevent canvas drag
    setDraggingId(id);
    setDragOffset({
      x: e.clientX - x,
      y: e.clientY - y,
    });
  };

  return (
    <div
      className="animate-pop-in absolute rounded-xl shadow-2xl"
      style={{
        left: position.x,
        top: position.y,
        minWidth: width ?? 'auto',
        minHeight: height ?? 'auto',
      }}
      onMouseDown={(e) => handleMouseDown(e, id, position.x, position.y)}
    >
      <div className="cursor-auto rounded-xl border border-gray-700 bg-gray-800 p-5">
        {children}
      </div>
    </div>
  );
}

export default WidgetContainer;

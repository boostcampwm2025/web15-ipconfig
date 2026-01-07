import type { WidgetData } from '@/common/types/widgetData';

import type { ComponentProps } from 'react';

function WidgetContainer({
  children,
  position,
  id,
  width,
  height,
}: ComponentProps<'div'> & WidgetData) {
  return (
    <div
      data-widget-id={id}
      className="animate-pop-in absolute rounded-xl shadow-2xl"
      style={{
        left: position.x,
        top: position.y,
        minWidth: width ?? 'auto',
        minHeight: height ?? 'auto',
      }}
    >
      <div className="cursor-auto rounded-xl border border-gray-700 bg-gray-800 p-5">
        {children}
      </div>
    </div>
  );
}

export default WidgetContainer;

import type { Cursor } from '@/common/types/cursor';
import TechStackWidget from '@/features/widgets/techStack/components/techStackWidget/TechStackWidget';
import { GitConventionWidget } from '@/features/widgets/gitConvention/components/gitConventionWidget';
import { useState } from 'react';
import type { Camera } from '@/common/types/camera';
import CursorWithName from '@/common/components/CursorWithName';
import { cn } from '@/common/lib/utils';
import type { WidgetContent, WidgetData } from '@/common/types/widgetData';

interface CanvasContainerProps {
  camera: Camera;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  isPanning: boolean;
  remoteCursor: Record<string, Cursor>;
  widgets: Record<string, WidgetData>;
  emitUpdateWidget: (widgetId: string, data: WidgetContent) => void;
  emitDeleteWidget: (widgetId: string) => void;
}

function CanvasContent({
  camera,
  containerRef,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  isPanning,
  remoteCursor,
  widgets,
  emitUpdateWidget,
  emitDeleteWidget,
}: CanvasContainerProps) {
  const [techStackPosition, setTechStackPosition] = useState({
    x: 500,
    y: 500,
  });

  return (
    // 뷰포트 레이어
    <div
      ref={containerRef}
      className={cn(
        `relative h-full w-full touch-none overflow-hidden bg-gray-900 select-none`,
        isPanning && 'cursor-grabbing',
      )}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* 캔버스 이동 이벤트 감지용 */}
      <div
        onPointerDown={handlePointerDown}
        className={`absolute inset-0 h-full w-full touch-none ${isPanning ? 'cursor-grabbing' : 'cursor-default'}`}
      />
      {/* 캔버스 좌표계의 원점 컨테이너 */}
      <div
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
          transformOrigin: '0 0',
        }}
        className="pointer-events-none absolute top-0 left-0 h-0 w-0 overflow-visible"
      >
        {/* 위젯 렌더링 */}
        {Object.entries(widgets).map(([widgetId, widget]) => (
          // TODO: 나중에 위젯 타입에 따라 분기처리 필요
          <TechStackWidget
            key={widgetId}
            widgetId={widgetId}
            data={widget}
            emitDeleteWidget={emitDeleteWidget}
            emitUpdateWidget={emitUpdateWidget}
          />
        ))}
        {/* 커서 렌더링 */}
        {Object.values(remoteCursor).map((cursor) => (
          <div
            key={cursor.userId}
            className="pointer-events-none absolute z-100"
            style={{
              transform: `translate(${cursor.x}px, ${cursor.y}px)`,
            }}
          >
            <CursorWithName
              nickname={cursor.nickname}
              color={cursor.color}
              backgroundColor={cursor.backgroundColor}
              x={cursor.x}
              y={cursor.y}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CanvasContent;

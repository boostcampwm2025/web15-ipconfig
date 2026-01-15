import type { Cursor } from '@/common/types/cursor';
import TechStackWidget from '@/features/widgets/techStack/components/techStackWidget/TechStackWidget';
import CommunicationWidget from '@/features/widgets/communication/components/communicationWidget/CommunicationWidget';
import { GitConventionWidget } from '@/features/widgets/gitConvention/components/gitConventionWidget';
import type { Camera } from '@/common/types/camera';
import type {
  WidgetContent,
  WidgetData,
  MoveWidgetData,
} from '@/common/types/widgetData';
import CollaborationWidget from '../widgets/collaboration/components/CollaborationWidget';
import CursorWithName from '@/common/components/CursorWithName';
import { cn } from '@/common/lib/utils';

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
  emitMoveWidget: (widgetId: string, data: MoveWidgetData) => void;
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
  emitMoveWidget,
}: CanvasContainerProps) {
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
        {Object.entries(widgets).map(([widgetId, widget]) => {
          switch (widget.content.widgetType) {
            case 'TECH_STACK':
              return (
                <TechStackWidget
                  key={widgetId}
                  widgetId={widgetId}
                  data={widget}
                  emitDeleteWidget={emitDeleteWidget}
                  emitUpdateWidget={emitUpdateWidget}
                  emitMoveWidget={emitMoveWidget}
                />
              );
            case 'GIT_CONVENTION':
              return (
                <GitConventionWidget
                  key={widgetId}
                  widgetId={widgetId}
                  data={widget}
                  emitDeleteWidget={emitDeleteWidget}
                  emitUpdateWidget={emitUpdateWidget}
                  emitMoveWidget={emitMoveWidget}
                />
              );
            default:
              return null;
          }
        })}
        <CollaborationWidget
          key={'GROUNDRULE_COLLABORATION'}
          widgetId={'GROUNDRULE_COLLABORATION'}
          data={{
            x: 300,
            y: 400,
            width: 850,
            height: 600,
            zIndex: 1,
          }}
        />
        <CommunicationWidget
          id="communication"
          position={{ x: 800, y: 1000 }}
          width={600}
          onDelete={() => emitDeleteWidget('communication')}
        />
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

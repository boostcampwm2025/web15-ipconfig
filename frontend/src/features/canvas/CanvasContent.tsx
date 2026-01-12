import type { Cursor } from '@/common/types/cursor';
import { TechStackWidget } from '../widgets/techStack/components/techStackWidget';
import { useState } from 'react';
import type { Camera } from '@/common/types/camera';
import CursorWithName from '@/common/components/CursorWithName';

interface CanvasContainerProps {
  camera: Camera;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: () => void;
  isPanning: boolean;
  remoteCursor: Record<string, Cursor>;
}

function CanvasContent({
  camera,
  containerRef,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  isPanning,
  remoteCursor,
}: CanvasContainerProps) {
  const [techStackPosition, setTechStackPosition] = useState({
    x: 500,
    y: 500,
  });

  return (
    // 뷰포트 레이어
    <div
      ref={containerRef}
      className={`relative h-full w-full touch-none overflow-hidden bg-gray-900 select-none`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
    >
      {/* 캔버스 이동 이벤트 감지용 */}
      <div
        className={`absolute inset-0 h-full w-full touch-none ${
          isPanning ? 'cursor-grabbing' : 'cursor-default'
        }`}
        onPointerDown={handlePointerDown}
        style={{}}
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
        <TechStackWidget
          id="tech-stack"
          position={techStackPosition}
          width={200}
          type="tech"
          content="Tech Stack"
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

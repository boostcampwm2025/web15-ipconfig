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
    <div
      ref={containerRef}
      className={`h-full w-full cursor-${isPanning ? 'grabbing' : 'default'} relative overflow-hidden bg-gray-900`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* World Container: 실제 변환(Transform)이 일어나는 레이어 */}
      <div
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
          transformOrigin: '0 0',
          width: 0,
          height: 0,
          overflow: 'visible',
        }}
        className="relative bg-white"
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
              left: cursor.x,
              top: cursor.y,
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

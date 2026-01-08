import type { Cursor } from '@/common/types/cursor';
import TechStackWidget from '@/features/widgets/techStack/components/TechStackWidget';
import { useState } from 'react';
import type { Camera } from '@/common/types/camera';
import CursorWithName from '@/common/components/cursorWithName';

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
      className={`h-full w-full cursor-${isPanning ? 'grabbing' : 'default'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* 배경 패턴 */}
      <div
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          backgroundImage:
            'radial-gradient(rgb(51,65,85) 1px, transparent 1px)',
          backgroundSize: `${20 * camera.scale}px ${20 * camera.scale}px`,
          backgroundPosition: `${camera.x % (20 * camera.scale)}px ${camera.y % (20 * camera.scale)}px`,
        }}
      />
      {/* World Container: 실제 변환(Transform)이 일어나는 레이어 */}
      <div
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
          transformOrigin: '0 0',
          width: '100%',
          height: '100%',
        }}
        className="relative"
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

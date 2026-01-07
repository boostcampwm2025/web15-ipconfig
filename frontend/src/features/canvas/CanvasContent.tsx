import CursorWithName from '@/common/components/cursorWithName';
import type { Cursor } from '@/common/types/cursor';
import TechStackWidget from '@/features/widgets/techStack/components/TechStackWidget';
import { useEffect, useState } from 'react';

function CanvasContent({
  mainWorkspaceRef,
  remoteCursors,
}: {
  mainWorkspaceRef: React.RefObject<HTMLDivElement>;
  remoteCursors: Record<string, Cursor>;
}) {
  // Tech Stack Widget Position
  const [techStackPosition, setTechStackPosition] = useState({
    x: 0,
    y: 0,
  });

  const [mainWorkspaceSize, setMainWorkspaceSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (mainWorkspaceRef.current) {
      setMainWorkspaceSize({
        width: mainWorkspaceRef.current.clientWidth,
        height: mainWorkspaceRef.current.clientHeight,
      });
    }
  }, [mainWorkspaceRef]);

  useEffect(() => {
    if (mainWorkspaceRef.current) {
      setTechStackPosition({
        x: mainWorkspaceRef.current.clientWidth / 2 - 200,
        y: mainWorkspaceRef.current.clientHeight / 2 - 100,
      });
    }
  }, [mainWorkspaceRef]);

  return (
    <main
      ref={mainWorkspaceRef}
      className="scrollbar-hide relative flex-1 cursor-grab overflow-auto bg-gray-900 active:cursor-grabbing"
    >
      {/* Background Pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          width: '2000px',
          height: '2000px',
        }}
      />

      {techStackPosition.x !== 0 && techStackPosition.y !== 0 && (
        <TechStackWidget
          id="tech-stack"
          position={techStackPosition}
          width={mainWorkspaceSize.width / 2 - 200}
          type="tech"
          content="Tech Stack"
        />
      )}

      {/* Remote Cursors Rendering */}
      {Object.values(remoteCursors).map((cursor) => (
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
    </main>
  );
}

export default CanvasContent;

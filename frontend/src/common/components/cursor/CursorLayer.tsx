import type { Cursors } from '@/common/types/cursor';
import CursorWithName from './CursorWithName';

function CursorLayer({ remoteCursors }: { remoteCursors: Cursors }) {
  return (
    <>
      {Object.values(remoteCursors).map((cursor) => (
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
            x={cursor.x}
            y={cursor.y}
          />
        </div>
      ))}
    </>
  );
}

export default CursorLayer;

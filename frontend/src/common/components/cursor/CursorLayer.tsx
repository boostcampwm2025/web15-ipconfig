import CursorWithName from './CursorWithName';
import useCursorStore from '@/common/store/cusor';

function CursorLayer() {
  const { cursorList } = useCursorStore();
  return (
    <>
      {cursorList.map((cursor) => (
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

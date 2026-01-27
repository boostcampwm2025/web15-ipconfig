import CursorWithName from './CursorWithName';
import useCursorStore from '@/common/store/cursor';
import { useCursorAwareness } from '@/common/hooks/useCursorAwareness';

function CursorLayer() {
  // Awareness change 이벤트 리스너 등록
  useCursorAwareness();

  const cursorList = useCursorStore((state) => state.cursorList);

  return (
    <>
      {cursorList.map((cursor) => (
        <div
          key={cursor.userId}
          className="pointer-events-none absolute z-[100]"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
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

// React.memo로 감싸서 props가 변경되지 않으면 리렌더링 방지
export default CursorLayer;

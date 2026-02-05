import { useMe } from '@/common/store/user';
import MyCursor from './MyCursor';
import { useCanvas } from '@/common/components/canvas/context/CanvasProvider';

// 내 커서만 렌더링 (뷰포트 좌표계로 변환)
function MyCursorLayer() {
  const me = useMe();
  const { camera } = useCanvas();

  if (!me) return null;

  const { nickname, color, cursor } = me;
  const { x, y, type, message } = cursor;

  return (
    <div
      className="pointer-events-none absolute z-[100]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transition: 'all 0.05s linear',
      }}
    >
      <MyCursor
        nickname={nickname}
        color={color}
        type={type}
        message={message}
        scale={camera.scale}
      />
    </div>
  );
}

export default MyCursorLayer;

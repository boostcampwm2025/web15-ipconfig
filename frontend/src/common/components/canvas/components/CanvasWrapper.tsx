import { useCanvas } from '../context/CanvasProvider';
import { type PropsWithChildren } from 'react';
import { cn } from '@/common/lib/utils';
import useWheel from '../hooks/useWheel';
import usePanning from '../hooks/usePanning';
import { useTheme } from '@/common/contexts/ThemeProvider';

export function CanvasWrapper({ children }: PropsWithChildren) {
  const { camera, frameRef, clickedFollow } = useCanvas();

  // 휠 이벤트 핸들러 등록
  useWheel();

  // 패닝 이벤트 핸들러
  const {
    isPanning,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleMouseMove,
  } = usePanning();

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    // 뷰포트 레이어
    <div
      ref={frameRef}
      id="canvas-wrapper"
      className={cn(
        'relative h-full w-full touch-none overflow-hidden select-none',
        isPanning && 'cursor-grabbing',
        isDark ? 'bg-gray-900' : 'bg-background',
      )}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onMouseMove={handleMouseMove}
    >
      {/* 캔버스 이동 이벤트 감지용 */}
      <div
        onPointerDown={handlePointerDown}
        className={cn(
          'absolute inset-0 h-full w-full touch-none',
          isPanning && 'cursor-grabbing',
        )}
      />
      {/* 캔버스 좌표계의 원점 컨테이너 */}
      <div
        style={{
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
          transformOrigin: '0 0',
        }}
        className={cn(
          'pointer-events-none absolute top-0 left-0 h-0 w-0 overflow-visible',
          clickedFollow && 'transition-transform duration-300',
        )}
      >
        {children}
      </div>
    </div>
  );
}

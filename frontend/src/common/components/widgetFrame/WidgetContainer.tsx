import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import type { PropsWithChildren } from 'react';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useWidgetIdAndType } from './context/WidgetContext';
import { useCanvas } from '../canvas/context/CanvasProvider';
import {
  clearEditingState,
  updateEditingState,
} from '@/common/api/yjs/awareness';
import {
  updateWidgetLayoutAction,
  bringToFrontAction,
} from '@/common/api/yjs/actions/widgetFrame';
import { useRemoteWidgetInteraction } from '@/common/hooks/useRemoteWidgetInteraction';

function WidgetContainer({ children }: PropsWithChildren) {
  const { widgetId } = useWidgetIdAndType();
  const { camera } = useCanvas();
  const widgetData = useWorkspaceWidgetStore((state) =>
    state.widgetList.find((widget) => widget.widgetId === widgetId),
  );

  const { x, y, width, height, zIndex } = widgetData?.layout ?? {
    x: 400,
    y: 400,
  };

  // 다른 사용자의 드래그 상태 감지
  const remoteInteraction = useRemoteWidgetInteraction(widgetId);

  // 드래그 시작 시점의 데이터 저장
  const dragStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    widgetX: 0,
    widgetY: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  // 스로틀링 위한 ref
  const lastEmitRef = useRef<number>(0);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // 위젯 클릭 시 최상단으로 이동 (z-index)
    bringToFrontAction(widgetId);

    // 헤더 영역이 아닌 곳에서는 드래그 시작하지 않음
    const target = e.target as HTMLElement;
    const isHeader = target.closest('[data-widget-header="true"]');
    if (!isHeader) return;

    // 캔버스 패닝으로 이벤트가 전파되지 않도록 중단
    e.stopPropagation();
    e.preventDefault();

    setIsDragging(true);
    setDragPos({ x, y });

    // 시작 시점의 위치 정보 저장
    dragStartRef.current = {
      mouseX: e.clientX, // 현재 브라우저에서 마우스 좌표
      mouseY: e.clientY, // 현재 브라우저에서 마우스 좌표
      widgetX: x, // 현재 위젯 위치
      widgetY: y, // 현재 위젯 위치
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      e.preventDefault();

      const { mouseX, mouseY, widgetX, widgetY } = dragStartRef.current;

      // 마우스 이동 거리 계산 (scale 보정)
      const deltaX = (e.clientX - mouseX) / camera.scale;
      const deltaY = (e.clientY - mouseY) / camera.scale;

      // 실제 위젯 위치 계산
      const actualX = widgetX + deltaX;
      const actualY = widgetY + deltaY;

      // 스로틀링으로 이벤트 전송
      const now = performance.now();
      if (now - lastEmitRef.current < 30) return;
      lastEmitRef.current = now;

      // 1) 로컬은 즉시 움직이게(UX)
      setDragPos({ x: actualX, y: actualY });

      // 2) 드래그 중에는 awareness로 "프리뷰"만 전파
      updateEditingState({
        widgetId,
        kind: 'move',
        preview: {
          x: actualX,
          y: actualY,
          width: width ?? undefined,
          height: height ?? undefined,
        },
      });
    };

    const handlePointerUp = () => {
      const finalPos = dragPos;
      setIsDragging(false);
      setDragPos(null);

      // 드래그 종료: 프리뷰 제거 + Doc에 최종 반영
      clearEditingState();
      if (finalPos) {
        updateWidgetLayoutAction(widgetId, { x: finalPos.x, y: finalPos.y });
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, widgetId, camera.scale, width, height, dragPos]);

  const renderedPos = useMemo(() => {
    // 1. 내가 드래그 중이면 내 로컬 state 우선
    if (isDragging && dragPos) return dragPos;
    // 2. 다른 사람이 드래그 중이면 awareness state 우선
    if (remoteInteraction)
      return { x: remoteInteraction.x, y: remoteInteraction.y };
    // 3. 둘 다 아니면 store state
    return { x, y };
  }, [isDragging, dragPos, remoteInteraction, x, y]);

  return (
    <div
      className="pointer-events-auto absolute w-fit rounded-xl border border-gray-700 bg-gray-800 transition-shadow duration-200"
      style={{
        left: renderedPos.x,
        top: renderedPos.y,
        width: width ?? 'auto',
        height: height ?? 'auto',
        zIndex: zIndex ?? 1,
      }}
      onPointerDown={handlePointerDown}
    >
      <div className="cursor-auto rounded-xl p-5">{children}</div>
    </div>
  );
}

export default WidgetContainer;

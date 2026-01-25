import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useWidgetIdAndType } from './context/WidgetContext';
import { useCanvas } from '../canvas/context/CanvasProvider';
import {
  clearEditingState,
  updateEditingState,
  updateLocalCursor,
} from '@/common/api/yjs/awareness';
import {
  updateWidgetLayoutAction,
  bringToFrontAction,
} from '@/common/api/yjs/actions/widgetFrame';
import { useWidgetInteractionStore } from '@/common/store/widgetInteraction';
import type { WidgetLayout } from '@/common/types/widgetData';
import { browserToCanvasPosition } from '../canvas/lib/positionTransform';

interface WidgetContainerProps {
  children: React.ReactNode;
  defaultLayout?: WidgetLayout;
}

function WidgetContainer({ children, defaultLayout }: WidgetContainerProps) {
  const { widgetId } = useWidgetIdAndType();
  const { camera, getFrameInfo } = useCanvas();
  const widgetData = useWorkspaceWidgetStore((state) =>
    state.widgetList.find((widget) => widget.widgetId === widgetId),
  );

  const { x, y, width, height, zIndex } = widgetData?.layout ??
    defaultLayout ?? {
      x: 400,
      y: 400,
    };

  const interaction = useWidgetInteractionStore((state) =>
    state.getInteraction(widgetId),
  );

  // 드래그 시작 시점의 데이터 저장
  const dragStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    widgetX: 0,
    widgetY: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

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

      // 드래그 중에는 awareness로 "프리뷰"만 전파 (내 상호작용도 이걸로 처리)
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

      // 3) 드래그 중에도 커서 위치 동기화 (Mouse Move가 stopPropagation 되므로 여기서 직접 호출)
      // 실제 마우스 위치를 캔버스 좌표로 변환하여 전송
      const frameInfo = getFrameInfo();
      const cursorCanvasPos = browserToCanvasPosition(
        { x: e.clientX, y: e.clientY },
        { x: frameInfo.left, y: frameInfo.top },
        camera,
      );
      updateLocalCursor(cursorCanvasPos.x, cursorCanvasPos.y);
    };

    const handlePointerUp = () => {
      setIsDragging(false);

      // 드래그 종료: 프리뷰 제거 + Doc에 최종 반영
      // 종료 시점의 위치는 store에 있는 마지막 interaction 위치를 사용
      const finalInteraction = useWidgetInteractionStore
        .getState()
        .getInteraction(widgetId);

      clearEditingState();

      if (finalInteraction) {
        updateWidgetLayoutAction(widgetId, {
          x: finalInteraction.x,
          y: finalInteraction.y,
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, widgetId, camera, width, height, getFrameInfo]);

  const renderedPos = useMemo(() => {
    // 1. Interaction(내꺼/남의꺼) 있으면 그거 우선
    if (interaction) {
      return { x: interaction.x, y: interaction.y };
    }
    // 2. 없으면 Yjs Doc state
    return { x, y };
  }, [interaction, x, y]);

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

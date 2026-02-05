import { useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useWidgetIdAndType } from './context/WidgetContext';
import { useCanvas } from '../canvas/context/CanvasProvider';
import {
  updateUserManipulationState,
  clearUserManipulationState,
} from '@/common/api/yjs/awareness';
import {
  updateWidgetLayoutAction,
  bringToFrontAction,
} from '@/common/api/yjs/actions/widgetFrame';

import type { PropsWithChildren } from 'react';
import { useUserStore } from '@/common/store/user';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/common/lib/utils';
import { getContrastClass } from '@/utils/color';

function WidgetContainer({ children }: PropsWithChildren) {
  const { widgetId } = useWidgetIdAndType();
  const { camera } = useCanvas();
  // 실제 YjsDoc에서 연동된 Zustand Store 값
  const widgetLayout = useWorkspaceWidgetStore(
    (state) =>
      state.widgetList.find((widget) => widget.widgetId === widgetId)?.layout,
  );

  // 이 위젯을 조작하고 있는 유저의 조작 상태
  const activeManipulation = useUserStore(
    (state) =>
      state.userList.find(
        (user) => user.manipulationState?.widgetId === widgetId,
      )?.manipulationState,
  );

  // 이 위젯을 조작하고 있는 유저
  const manipulatingUser = useUserStore(
    useShallow((state) => {
      const user = state.userList.find(
        (user) => user.manipulationState?.widgetId === widgetId,
      );
      return {
        id: user?.id,
        nickname: user?.nickname,
        color: user?.color,
      };
    }),
  );

  if (!widgetLayout) {
    throw new Error(`ID: ${widgetId} 유효하지 않은 위젯입니다.`);
  }

  const { x, y, width, height, zIndex } = widgetLayout;

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

    // // 캔버스 패닝으로 이벤트가 전파되지 않도록 중단
    // e.stopPropagation();
    // e.preventDefault();

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

      // awareness 업데이트 (위젯 이동)
      updateUserManipulationState({
        widgetId,
        type: 'move',
        layout: {
          x: actualX,
          y: actualY,
        },
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);

      // 드래그 종료: Doc에 최종 반영 후 activeManipulation null 값으로 초기화
      // Doc을 먼저 보내면 수신측에서 "awareness manipulationState 사라짐 → 폴백" 시점에 이미 새 좌표가 도착하도록 해 튕김 방지
      if (activeManipulation) {
        updateWidgetLayoutAction(widgetId, {
          x: activeManipulation.layout.x,
          y: activeManipulation.layout.y,
        });
      }
      // awareness activeManipulation 초기화 (위젯 이동 종료)
      clearUserManipulationState();
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, widgetId, camera, activeManipulation, x, y]);

  const renderedPos = useMemo(() => {
    if (activeManipulation)
      return { x: activeManipulation.layout.x, y: activeManipulation.layout.y };
    return { x, y };
  }, [activeManipulation, x, y]);

  return (
    <div
      className="border-border bg-card pointer-events-auto absolute w-fit rounded-xl border-[1.5px] transition-shadow duration-200"
      style={{
        left: renderedPos.x,
        top: renderedPos.y,
        width: width ?? 'auto',
        height: height ?? 'auto',
        zIndex: zIndex ?? 1,
        borderColor: manipulatingUser.color,
      }}
      onPointerDown={handlePointerDown}
    >
      <div
        className={cn(
          'absolute top-0 left-1/2 -translate-x-1/2 rounded-xs px-2 text-[9px] font-semibold',
          manipulatingUser.color && getContrastClass(manipulatingUser.color),
        )}
        style={{
          backgroundColor: manipulatingUser.color,
        }}
      >
        {manipulatingUser.nickname}
      </div>
      <div className="cursor-auto rounded-xl p-5">{children}</div>
    </div>
  );
}

export default WidgetContainer;

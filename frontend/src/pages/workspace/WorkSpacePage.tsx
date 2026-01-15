import React, { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { User } from '@/common/types/user';

import { getRandomColor } from '@/utils/getRandomColor';
import { useSocket } from '@/common/hooks/useSocket';
import { useMarkdown } from '@/common/hooks/useMarkdown';
import CanvasContent from '@/features/canvas/CanvasContent';
import ToolBar from '@/pages/workspace/components/toolbar/ToolBar';
import type { Cursor } from '@/common/types/cursor';
import type { WidgetData } from '@/common/types/widgetData';

// Page-specific components
import WorkspaceHeader from './components/WorkspaceHeader';
import RightSidebar from './components/infoPanel/InfoPanel';
import UserHoverCard from './components/UserHoverCard';
import ZoomControls from './components/ZoomControls';
import ExportModal from './components/ExportModal';
import useCanvas from '@/features/canvas/hooks/useCanvas';
import CompactPanel from './components/infoPanel/CompactPanel';
import { INITIAL_USERS } from '@/common/mocks/users';

function WorkSpacePage() {
  const [remoteCursors, setRemoteCursors] = useState<Record<string, Cursor>>(
    {},
  );
  const [widgets, setWidgets] = useState<Record<string, WidgetData>>({});

  // UI State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const {
    camera,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleZoomButton,
    isPanning,
    getMousePosition,
  } = useCanvas();
  // 마크다운 관리 hook
  const { markdown: exportMarkdown, fetchMarkdown } = useMarkdown();

  // 임시로 고정된 워크스페이스 / 사용자 정보 (실제 서비스에서는 라우팅/로그인 정보 사용)
  const workspaceId = 'w1';

  // 유저는 어떻게 처리해야 할까요..? 일단 커서를 구현하면서 임시로 만들어놨는데
  const currentUser = useState(() => {
    const generateUUID = () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    const randomNickname = Math.floor(Math.random() * 10000);

    return {
      id: generateUUID(),
      nickname: `임시 유저 ${randomNickname}`,
      color: getRandomColor(),
      backgroundColor: getRandomColor(),
    };
  })[0];

  // ----- WebSocket 초기화 & 이벤트 바인딩 -----
  const {
    emitCursorMove,
    emitCreateWidget,
    emitUpdateWidget,
    emitDeleteWidget,
    emitMoveWidget,
  } = useSocket({
    workspaceId,
    currentUser,
    setRemoteCursors,
    setWidgets,
  });

  // 커서 이동 스로틀링을 위한 ref
  const lastEmitRef = useRef<number>(0);

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    handlePointerMove(e);

    const now = performance.now();
    if (now - lastEmitRef.current < 30) return;
    lastEmitRef.current = now;

    const { x: worldX, y: worldY } = getMousePosition(e);

    emitCursorMove(worldX, worldY);
  };

  // User Hover Logic
  const handleUserHover = (e: React.MouseEvent, user: User) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({
      top: Math.min(rect.top, window.innerHeight - 250),
      left: rect.left - 280,
    });
    setHoveredUser(user);
  };

  const handleUserLeave = () => {
    setHoveredUser(null);
  };

  const handleExportClick = useCallback(async () => {
    try {
      await fetchMarkdown(workspaceId);
      setIsExportModalOpen(true);
    } catch {
      // 일단 alert를 사용했는데, 그냥 마크다운 내용으로 (마크다운 생성 실패)를 보내는 것도 나쁘지 않을 것 같습니다!
      alert('마크다운 생성에 실패했습니다.');
    }
  }, [workspaceId, fetchMarkdown]);

  return (
    <div className="relative h-screen overflow-hidden bg-gray-900 text-gray-100 [--header-h:4rem]">
      {/* 캔버스: 화면 전체 */}
      <div className="absolute inset-0">
        <main className="relative h-full w-full flex-1">
          <CanvasContent
            camera={camera}
            containerRef={containerRef}
            handlePointerDown={handlePointerDown}
            handlePointerMove={handleCanvasPointerMove}
            handlePointerUp={handlePointerUp}
            isPanning={isPanning}
            remoteCursor={remoteCursors}
            widgets={widgets}
            emitUpdateWidget={emitUpdateWidget}
            emitDeleteWidget={emitDeleteWidget}
            emitMoveWidget={emitMoveWidget}
          />
        </main>
      </div>

      {/* 헤더: 최상단 오버레이 */}
      <div className="pointer-events-none absolute top-0 left-0 z-50 w-full">
        <div className="pointer-events-auto">
          <WorkspaceHeader onExportClick={handleExportClick} />
        </div>
      </div>

      {/* HUD 레이어 */}
      <div className="pointer-events-none absolute inset-0 z-40 pt-[var(--header-h)]">
        <div className="pointer-events-auto">
          <div className="absolute top-0 left-0">
            <ToolBar onToolClick={emitCreateWidget} />
          </div>
          <AnimatePresence mode="sync">
            {isSidebarExpanded ? (
              <motion.div
                key="sidebar"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="pointer-events-auto absolute top-0 right-0 bottom-0"
              >
                <RightSidebar
                  onUserHover={handleUserHover}
                  onUserLeave={handleUserLeave}
                  onToggle={() => setSidebarExpanded((p) => !p)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="compact"
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.3 }}
                className="absolute top-18 right-6"
              >
                <CompactPanel
                  members={INITIAL_USERS}
                  currentAgenda=""
                  currentTime=""
                  isExpanded={false}
                  onToggle={() => setSidebarExpanded((p) => !p)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <ZoomControls handleZoomButton={handleZoomButton} camera={camera} />
        </div>
      </div>

      {hoveredUser && (
        <UserHoverCard user={hoveredUser} position={hoverPosition} />
      )}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        markdown={exportMarkdown}
      />
    </div>
  );
}

export default WorkSpacePage;

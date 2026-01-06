import React, {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react';

import type { WidgetData } from '@/common/types/widgetData';
import type { User } from '@/common/types/user';
import TechStackModal from '@/features/widgets/techStack/components/modal/TechStackModal';

import { getRandomColor } from '@/utils/getRandomColor';
import { useSocket } from '@/common/hooks/useSocket';
import CanvasContent from '@/features/canvas/CanvasContent';
import ToolBar from '@/pages/workspace/components/toolbar/ToolBar';
import type { Cursor } from '@/common/types/cursor';

// Page-specific components
import RightSidebar from './components/infoPanel/InfoPanel';
import UserHoverCard from './components/UserHoverCard';
import ZoomControls from './components/ZoomControls';
import ExportModal from './components/ExportModal';
import WorkspaceHeader from './components/WorkSpaceHeader';
import useCanvas from '@/features/canvas/useCanvas';

function WorkSpacePage() {
  const mainWorkspaceRef = useRef<HTMLDivElement>(null);
  const [remoteCursors, setRemoteCursors] = useState<Record<string, Cursor>>(
    {},
  );
  const [isTechStackModalOpen, setIsTechStackModalOpen] = useState(true);

  // Global State
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  const [techStack, setTechStack] = useState<Set<string>>(new Set(['React']));

  // UI State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [hoveredUser, setHoveredUser] = useState<User | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });

  const {
    camera,
    containerRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleZoomButton,
    isPanning,
    draggingWidgetId,
  } = useCanvas();

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
  const { emitCursorMove } = useSocket({
    workspaceId,
    currentUser,
    setRemoteCursors,
  });

  // --- Handlers ---
  const handleModalClose = useCallback(() => {
    setIsTechStackModalOpen(false);
  }, []);

  // 커서 이동 스로틀링을 위한 ref
  const lastEmitRef = useRef<number>(0);

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    // 1. 캔버스/위젯 이동 로직 실행 (useCanvas)
    handlePointerMove(e);

    // 2. 소켓으로 내 커서 위치 전송 (스로틀링 적용)
    const now = performance.now();
    const throttleMs = 30;
    if (now - lastEmitRef.current < throttleMs) return;
    lastEmitRef.current = now;

    // [중요] Screen 좌표 -> World 좌표로 변환
    // 캔버스 컴포넌트가 World 좌표 기준으로 렌더링하기 때문에, 데이터도 World 기준으로 보내야 합니다.
    const worldX = (e.clientX - camera.x) / camera.z;
    const worldY = (e.clientY - camera.y) / camera.z;

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

  return (
    <div className="dark flex h-screen flex-col overflow-hidden bg-gray-900 font-sans text-gray-100">
      {/* Hide Scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <WorkspaceHeader onExportClick={() => setIsExportModalOpen(true)} />

      {/* Main Workspace */}
      <div className="relative flex flex-1 overflow-hidden">
        <ToolBar />
        <CanvasContent
          camera={camera}
          containerRef={containerRef}
          handlePointerDown={handlePointerDown}
          handlePointerMove={handleCanvasPointerMove}
          handlePointerUp={handlePointerUp}
          isPanning={isPanning}
          draggingWidgetId={draggingWidgetId}
          remoteCursor={remoteCursors}
        />

        <RightSidebar
          onUserHover={handleUserHover}
          onUserLeave={handleUserLeave}
        />

        {hoveredUser && (
          <UserHoverCard user={hoveredUser} position={hoverPosition} />
        )}

        <ZoomControls handleZoomButton={handleZoomButton} camera={camera} />

        {isTechStackModalOpen && (
          <TechStackModal onModalClose={handleModalClose} />
        )}
      </div>

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        techStack={techStack}
      />
    </div>
  );
}

export default WorkSpacePage;

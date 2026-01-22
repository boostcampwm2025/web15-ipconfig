import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { UserExtended } from '@/common/types/user';

import { useMarkdown } from '@/common/hooks/useMarkdown';

// Page-specific components
import WorkspaceHeader from './components/WorkspaceHeader';
import RightSidebar from './components/infoPanel/InfoPanel';
import UserHoverCard from './components/UserHoverCard';
import ExportModal from './components/ExportModal';
import CompactPanel from './components/infoPanel/CompactPanel';
import { INITIAL_USERS } from '@/common/mocks/users';
import { Canvas } from '@/common/components/canvas';
import ToolBar from './components/toolbar/ToolBar';
import { joinRoom, leaveRoom } from '@/common/api/socket';
import { useWorkspaceInfoStore } from '@/common/store/workspace';
import { generateCurrentUser } from '@/common/lib/user';
import { useCollaboration } from '@/common/hooks/useCollaboration';

function WorkSpacePage() {
  // UI State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [hoveredUser, setHoveredUser] = useState<UserExtended | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const { workspaceId } = useWorkspaceInfoStore();
  useCollaboration(workspaceId);

  useEffect(() => {
    // 소켓 연결
    joinRoom(generateCurrentUser());
    return () => {
      leaveRoom();
    };
  }, []);

  // 마크다운 관리 hook
  const { markdown: exportMarkdown, fetchMarkdown } = useMarkdown();

  // User Hover Logic
  const handleUserHover = (e: React.MouseEvent, user: UserExtended) => {
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
  }, [fetchMarkdown, workspaceId]);

  return (
    <div className="relative h-screen overflow-hidden bg-gray-900 text-gray-100 [--header-h:4rem]">
      {/* 헤더: 최상단 오버레이 */}
      <div className="pointer-events-none absolute top-0 left-0 z-50 w-full">
        <div className="pointer-events-auto">
          <WorkspaceHeader onExportClick={handleExportClick} />
        </div>
      </div>

      {/* 캔버스: 화면 전체 */}
      <div className="absolute inset-0">
        <main className="relative h-full w-full flex-1">
          <Canvas />
        </main>
      </div>

      {/* HUD 레이어 */}
      <div className="pointer-events-none absolute inset-0 z-40 pt-[var(--header-h)]">
        <div className="pointer-events-auto">
          <div className="absolute top-0 left-0">
            <ToolBar />
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

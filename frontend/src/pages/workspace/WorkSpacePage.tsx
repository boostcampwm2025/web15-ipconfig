import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router';

import type { UserExtended } from '@/common/types/user';

// Page-specific components
import WorkspaceHeader from './components/header/WorkspaceHeader';
import RightSidebar from './components/infoPanel/InfoPanel';
import UserHoverCard from './components/UserHoverCard';
import CompactPanel from './components/infoPanel/CompactPanel';
import { INITIAL_USERS } from '@/common/mocks/users';
import { Canvas } from '@/common/components/canvas';
import ToolBar from './components/toolbar/ToolBar';
import { useCollaboration } from '@/common/hooks/useCollaboration';
import { useWorkspaceGuard } from '@/common/hooks/useWorkspaceGuard';
import { generateCurrentUser } from '@/common/lib/user';
import useUserStore from '@/common/store/user';
import { setLocalUser } from '@/common/api/yjs/awareness';
import { LoadingSpinner } from '@/common/components/LoadingSpinner';

function WorkSpacePage() {
  // Workspace State
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const isWorkspaceReady = useWorkspaceGuard(workspaceId);
  useCollaboration(isWorkspaceReady && workspaceId ? workspaceId : '');

  useEffect(() => {
    if (!workspaceId) return;

    const user = generateCurrentUser();
    setUser(user);
    setLocalUser({
      id: user.id,
      nickname: user.nickname,
      color: user.color,
      backgroundColor: user.backgroundColor,
    });
  }, [workspaceId, setUser]);

  // UI State
  const [hoveredUser, setHoveredUser] = useState<UserExtended | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0 });

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

  if (!isWorkspaceReady) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gray-900 text-gray-100 [--header-h:4rem]">
      {/* 헤더: 최상단 오버레이 */}
      <div className="pointer-events-none absolute top-0 left-0 z-50 w-full">
        <div className="pointer-events-auto">
          <WorkspaceHeader />
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
    </div>
  );
}

export default WorkSpacePage;

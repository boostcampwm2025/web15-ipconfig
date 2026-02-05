import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';

// Page-specific components
import WorkspaceHeader from './components/header/WorkspaceHeader';
import { Canvas, CanvasProvider } from '@/common/components/canvas';
import ToolBar from './components/toolbar/ToolBar';
import { useWorkspaceInfoStore } from '@/common/store/workspace';
import { useCollaboration } from '@/common/hooks/useCollaboration';
import { LoadingSpinner } from '@/common/components/LoadingSpinner';
import { useWorkspaceGuard } from '@/common/hooks/useWorkspaceGuard';
import WorkspaceTour from '@/features/tour/WorkspaceTour';
import { useMyCursorType } from '@/common/store/user';

function WorkSpacePage() {
  const navigate = useNavigate();

  // Workspace State
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const setWorkspaceId = useWorkspaceInfoStore((state) => state.setWorkspaceId);
  const { isReady: isWorkspaceReady, userNickname } =
    useWorkspaceGuard(workspaceId);
  useCollaboration(
    isWorkspaceReady && workspaceId ? workspaceId : '',
    userNickname,
  );

  const myCursorType = useMyCursorType();

  useEffect(() => {
    if (!workspaceId) {
      navigate('/'); // 나중에 에러페이지 만들기
      return;
    }
    setWorkspaceId(workspaceId);
  }, [workspaceId, setWorkspaceId, navigate]);

  if (!isWorkspaceReady) {
    return <LoadingSpinner />;
  }

  return (
    <CanvasProvider>
      <WorkspaceTour />
      <div
        className="text-foreground relative h-screen overflow-hidden bg-transparent"
        data-cursor-mode={myCursorType}
      >
        {/* 캔버스: 화면 전체 */}
        <WorkspaceHeader />
        <main className="absolute inset-0">
          <Canvas />
        </main>

        {/* HUD 레이어 */}
        <div className="pointer-events-none absolute inset-0 z-40 pt-[var(--header-h)]">
          <div className="pointer-events-auto">
            <div className="absolute top-0 left-0">
              <ToolBar />
            </div>
          </div>
        </div>
      </div>
    </CanvasProvider>
  );
}

export default WorkSpacePage;

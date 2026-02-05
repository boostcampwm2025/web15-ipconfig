import { useParams } from 'react-router';

// Page-specific components
import WorkspaceHeader from './components/header/WorkspaceHeader';
import { Canvas, CanvasProvider } from '@/common/components/canvas';
import ToolBar from './components/toolbar/ToolBar';
import { useCollaboration } from '@/common/hooks/useCollaboration';
import { LoadingSpinner } from '@/common/components/LoadingSpinner';
import { useWorkspaceGuard } from '@/common/hooks/useWorkspaceGuard';
import WorkspaceTour from '@/features/tour/WorkspaceTour';
import { useMyCursorType } from '@/common/store/user';

function WorkSpacePage() {
  // Workspace State
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { isReady: isWorkspaceReady, userNickname } =
    useWorkspaceGuard(workspaceId);

  useCollaboration(
    isWorkspaceReady && workspaceId ? workspaceId : '',
    userNickname,
  );

  const myCursorType = useMyCursorType();

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
        <ToolBar />
      </div>
    </CanvasProvider>
  );
}

export default WorkSpacePage;

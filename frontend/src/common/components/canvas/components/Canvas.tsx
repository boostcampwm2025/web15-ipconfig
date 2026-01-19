import CursorLayer from '@/common/components/cursor/CursorLayer';
import WidgetLayer from '@/common/components/widgetFrame/WidgetLayer';
import { CanvasProvider } from '@/common/components/canvas/context/CanvasProvider';
import ZoomControls from '@/common/components/canvas/components/ZoomControls';
import { CanvasWrapper } from './CanvasWrapper';

function CanvasContent() {
  return (
    <CanvasWrapper>
      {/* 위젯 렌더링 */}
      <WidgetLayer />
      {/* 커서 렌더링 */}
      <CursorLayer />
    </CanvasWrapper>
  );
}

function Canvas() {
  return (
    <CanvasProvider>
      <CanvasContent />
      <ZoomControls />
    </CanvasProvider>
  );
}

export default Canvas;

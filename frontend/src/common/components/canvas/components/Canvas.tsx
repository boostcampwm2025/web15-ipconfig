import CursorLayer from '@/common/components/cursor/CursorLayer';
import WidgetLayer from '@/common/components/widgetFrame/WidgetLayer';
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
    <>
      <CanvasContent />
      <ZoomControls />
    </>
  );
}

export default Canvas;

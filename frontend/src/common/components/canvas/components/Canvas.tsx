import CursorLayer from '@/common/components/cursor/CursorLayer';
import MyCursorLayer from '@/common/components/cursor/MyCursorLayer';
import WidgetLayer from '@/common/components/widgetFrame/WidgetLayer';
import ZoomControls from '@/common/components/canvas/components/ZoomControls';
import { CanvasWrapper } from './CanvasWrapper';

function CanvasContent() {
  return (
    <>
      <CanvasWrapper>
        {/* 위젯 렌더링 */}
        <WidgetLayer />
        {/* 다른 유저 커서 렌더링 (캔버스 좌표계) */}
        <CursorLayer />
        {/* 내 커서 렌더링 (항상 가장 위에 렌더링) */}
        <MyCursorLayer />
      </CanvasWrapper>
    </>
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

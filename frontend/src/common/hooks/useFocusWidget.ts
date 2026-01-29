import { useCallback } from 'react';
import { useCanvas } from '@/common/components/canvas/context/CanvasProvider';

import type { WidgetData } from '@/common/types/widgetData';
import { getCameraByCursorPosition } from '@/common/components/canvas/lib/positionTransform';

export function useFocusWidget() {
  const { camera, setCamera, getFrameInfo, setClickedFollow } = useCanvas();
  // The user deleted useSmoothCamera in Step 188 and switched to CSS transition logic in ToolBar.
  // So I should replicate the logic from ToolBar, not use useSmoothCamera.

  const focusWidget = useCallback(
    (widget: WidgetData) => {
      setClickedFollow(true);
      const { x, y, width = 300, height = 300 } = widget.layout;

      const widgetCenterX = x + width / 2;
      const widgetCenterY = y + height / 2;

      const targetCamera = getCameraByCursorPosition({
        frameInfo: getFrameInfo(),
        cursorPosition: { x: widgetCenterX, y: widgetCenterY },
        camera,
      });

      setCamera(targetCamera);

      setTimeout(() => {
        setClickedFollow(false);
      }, 300);
    },
    [camera, getFrameInfo, setCamera, setClickedFollow],
  );

  return { focusWidget };
}

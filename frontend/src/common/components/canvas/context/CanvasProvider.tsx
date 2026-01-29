import type { Camera } from '@/common/types/camera';
import {
  useRef,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from 'react';
import { createContext } from '@/common/contexts/createContext';
import type { FrameInfo } from '@/common/types/canvas';

interface CanvasContext {
  camera: Camera;
  setCamera: Dispatch<SetStateAction<Camera>>;
  frameRef: React.RefObject<HTMLDivElement | null>;
  getFrameInfo: () => FrameInfo;
  clickedFollow: boolean;
  setClickedFollow: Dispatch<SetStateAction<boolean>>;
}

const [CanvasContextProvider, useCanvasContext] = createContext<CanvasContext>({
  contextName: 'CanvasContext',
  hookName: 'useCanvasContext',
  providerName: 'CanvasContextProvider',
});

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 });
  const [clickedFollow, setClickedFollow] = useState<boolean>(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const getFrameInfo = useCallback(() => {
    if (!frameRef.current) return { left: 0, top: 0, width: 0, height: 0 };
    const rect = frameRef.current.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    } as const;
  }, [frameRef]);

  return (
    <CanvasContextProvider
      value={{
        camera,
        setCamera,
        frameRef,
        getFrameInfo,
        clickedFollow,
        setClickedFollow,
      }}
    >
      {children}
    </CanvasContextProvider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCanvas() {
  return useCanvasContext();
}

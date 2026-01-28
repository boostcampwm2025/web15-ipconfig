import { create } from 'zustand';
import type { Camera } from '@/common/types/camera';

interface CanvasStore {
  camera: Camera;
  setCamera: (camera: Camera | ((prev: Camera) => Camera)) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  camera: { x: 0, y: 0, scale: 1 },
  setCamera: (update) =>
    set((state) => {
      const newCamera =
        typeof update === 'function' ? update(state.camera) : update;
      return { camera: newCamera };
    }),
}));

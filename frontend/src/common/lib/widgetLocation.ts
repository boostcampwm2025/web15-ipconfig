import type { Camera } from '@/common/types/camera';

export const getRandomWidgetLocation = (camera: Camera) => {
  const centerX = (window.innerWidth / 2 - camera.x) / camera.scale;
  const centerY = (window.innerHeight / 2 - camera.y) / camera.scale;
  // 약간의 랜덤 오프셋 추가 (-50 ~ +50)
  return {
    x: centerX + (Math.random() * 100 - 50),
    y: centerY + (Math.random() * 100 - 50),
  };
};

import type { Position } from '@/common/types/canvas';
import type { Camera } from '@/common/types/camera';

/**
 * 브라우저 기준 좌표를 캔버스 좌표계 좌표로 변환
 * @param browserPoint 브라우저 기준 좌표
 * @param framePoint 캔버스 프레임 기준 좌표
 * @param camera 카메라 좌표 (캔버스 좌표계의 원점(0, 0)이 화면(프레임)의 어디에 그려지는가)
 * @returns 캔버스 좌표계 좌표
 */
export function browserToCanvas(
  { x: browserX, y: browserY }: Position,
  { x: frameX, y: frameY }: Position,
  camera: Camera,
): Position {
  // 1단계: 브라우저 기준 좌표 -> 캔버스 프레임 기준 좌표 변환
  // 뷰포트에서의 변환하고 싶은 좌표 - 뷰포트에서의 캔버스 컨테이너의 좌표 = 캔버스 컨테이너에서의 마우스 좌표
  const xInFrame = browserX - frameX;
  const yInFrame = browserY - frameY;

  // 3단계: 월드 좌표계 좌표
  // 캔버스 컨테이너에서의 좌표 - 카메라 좌표 = 월드 좌표계에서의 좌표
  const xInCanvas = (xInFrame - camera.x) / camera.scale;
  const yInCanvas = (yInFrame - camera.y) / camera.scale;

  return { x: xInCanvas, y: yInCanvas };
}

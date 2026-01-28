import type { FrameInfo, Position } from '@/common/types/canvas';
import type { Camera } from '@/common/types/camera';
import { ZOOM_CONFIG } from '../constants/zoom';
import { CANVAS_CONFIG } from '../constants/canvas';

/**
 * 브라우저 기준 좌표를 캔버스 프레임 내부 좌표로 변환
 * @param browserPoint 브라우저 기준 좌표
 * @param frameInfo 캔버스 프레임의 left, top 좌표
 * @returns 브라우저 기준 좌표에서 캔버스 프레임의 left, top 좌표를 빼서 프레임 내부의 좌표로 변환
 */
export function browserToFramePosition(
  { x: xInBrowser, y: yInBrowser }: Position,
  { x: frameLeft, y: frameTop }: Position,
): Position {
  return { x: xInBrowser - frameLeft, y: yInBrowser - frameTop };
}

/**
 * 캔버스 프레임 내부 좌표를 캔버스 좌표계 좌표로 변환
 * @param framePoint 캔버스 프레임 내부 좌표
 * @param camera 카메라 좌표 (캔버스 좌표계의 원점(0, 0)이 프레임 내부 어디에 그려지는가)
 * @returns 캔버스 좌표계 좌표
 */
export function frameToCanvasPosition(
  { x: xInFrame, y: yInFrame }: Position,
  camera: Camera,
): Position {
  const xInCanvas = (xInFrame - camera.x) / camera.scale;
  const yInCanvas = (yInFrame - camera.y) / camera.scale;

  return { x: xInCanvas, y: yInCanvas };
}

/**
 * 캔버스 좌표계 좌표를  프레임 내부 좌표로 변환
 * @param canvasPoint 캔버스 좌표계 좌표
 * @param camera 카메라 좌표 (캔버스 좌표계의 원점(0, 0)이 프레임 내부 어디에 그려지는가)
 * @returns 프레임 내부 좌표
 */
export function canvasToFramePosition(
  { x: xInCanvas, y: yInCanvas }: Position,
  camera: Camera,
): Position {
  const xInFrame = xInCanvas * camera.scale + camera.x;
  const yInFrame = yInCanvas * camera.scale + camera.y;
  return { x: xInFrame, y: yInFrame };
}

/**
 * 브라우저 기준 좌표를 캔버스 좌표계 좌표로 변환
 * @param browserPoint 브라우저 기준 좌표
 * @param framePoint 캔버스 프레임 기준 좌표
 * @param camera 카메라 좌표 (캔버스 좌표계의 원점(0, 0)이 화면(프레임)의 어디에 그려지는가)
 * @returns 캔버스 좌표계 좌표
 */
export function browserToCanvasPosition(
  positionInBrowser: Position,
  frameLeftTopPosition: Position,
  camera: Camera,
): Position {
  // 1단계: 브라우저 기준 좌표 -> 캔버스 프레임 기준 좌표 변환
  // 뷰포트에서의 변환하고 싶은 좌표 - 뷰포트에서의 캔버스 컨테이너의 좌표 = 캔버스 컨테이너에서의 마우스 좌표
  const { x: xInFrame, y: yInFrame } = browserToFramePosition(
    positionInBrowser,
    frameLeftTopPosition,
  );

  // 3단계: 월드 좌표계 좌표
  // 캔버스 컨테이너에서의 좌표 - 카메라 좌표 = 월드 좌표계에서의 좌표
  const positionInCanvas = frameToCanvasPosition(
    { x: xInFrame, y: yInFrame },
    camera,
  );

  return positionInCanvas;
}

interface CameraDelta {
  dx?: number; // delta x
  dy?: number; // delta y
  ds?: number; // delta scale
}

/**
 * 카메라 상태를 업데이트하는 함수
 * @param currentCamera 현재 카메라 상태
 * @param delta 카메라 상태 변화량
 * @returns 새로운 카메라 상태
 */
export const getNewCameraState = (
  currentCamera: Camera,
  delta: CameraDelta,
): Camera => {
  const { dx, dy, ds } = delta;

  const newX = Math.min(
    Math.max(currentCamera.x + (dx ?? 0), CANVAS_CONFIG.MIN_X),
    CANVAS_CONFIG.MAX_X,
  );

  const newY = Math.min(
    Math.max(currentCamera.y + (dy ?? 0), CANVAS_CONFIG.MIN_Y),
    CANVAS_CONFIG.MAX_Y,
  );

  const newScale = Math.min(
    Math.max(currentCamera.scale + (ds ?? 0), ZOOM_CONFIG.MIN_ZOOM),
    ZOOM_CONFIG.MAX_ZOOM,
  );

  return { x: newX, y: newY, scale: newScale };
};

/**
 * 마우스 휠 델타 y에 따라 카메라 상태를 업데이트하는 함수
 * @param deltaY 마우스 휠 델타 y
 * @param pivot 피벗 좌표 (줌의 중심이 되는 좌표)
 * @param camera 현재 카메라 상태
 * @returns 새로운 카메라 상태
 */
export const zoomByDeltaAtPivot = (
  zoomDelta: number,
  pivot: Position,
  camera: Camera,
) => {
  // 스케일만 먼저 계산
  const newScale = Math.min(
    Math.max(camera.scale + zoomDelta, ZOOM_CONFIG.MIN_ZOOM),
    ZOOM_CONFIG.MAX_ZOOM,
  );

  if (newScale === camera.scale) return camera;

  // 스케일 적용 후 x, y 변화량 계산
  const ratio = newScale / camera.scale;
  const newX = pivot.x - (pivot.x - camera.x) * ratio;
  const newY = pivot.y - (pivot.y - camera.y) * ratio;

  return { x: newX, y: newY, scale: newScale };
};

export function getCameraByCursorPosition({
  frameInfo,
  cursorPosition,
  camera,
}: {
  frameInfo: FrameInfo;
  cursorPosition: Position;
  camera: Camera;
}): Camera {
  const { width, height } = frameInfo;
  const { x: cursorX, y: cursorY } = cursorPosition;

  const newCameraX = width / 2 - cursorX * camera.scale;
  const newCameraY = height / 2 - cursorY * camera.scale;

  return { x: newCameraX, y: newCameraY, scale: camera.scale };
}

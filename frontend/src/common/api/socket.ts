import { io } from 'socket.io-client';
import type { User } from '@/common/types/user';
import type {
  CreateWidgetData,
  UpdateWidgetData,
  UpdateWidgetLayoutData,
} from '@/common/types/widgetData';
import useWorkspaceStore from '@/common/store/workspace';
import useUserStore from '@/common/store/user';

const socketUrl =
  import.meta.env.MODE === 'production'
    ? window.location.origin
    : 'http://localhost:3000';

export const socket = io(`${socketUrl}/workspace`, {
  transports: ['polling', 'websocket'],
});

/**
 * 워크스페이스 입장
 * @param currentUser 현재 유저
 */
export function joinRoom(currentUser: User) {
  const workspaceId = useWorkspaceStore.getState().workspaceId;
  socket.emit('user:join', {
    workspaceId,
    user: {
      id: currentUser.id,
      nickname: currentUser.nickname,
      color: currentUser.color,
    },
  });
}

/**
 * 워크스페이스 퇴장
 */
export function leaveRoom() {
  const workspaceId = useWorkspaceStore.getState().workspaceId;
  const userId = useUserStore.getState().user.id;

  socket.emit('user:leave', { workspaceId, userId });
  socket.disconnect();
}

/**
 * 워크스페이스 유저 입장
 * @param handler 핸들러
 */
interface UserJoinedPayload {
  allUsers: User[];
  allWidgets: CreateWidgetData[];
}

/**
 * 워크스페이스 유저 입장
 * @param handler 핸들러
 */
export function onUserJoined(handler: (payload: UserJoinedPayload) => void) {
  socket.on('user:joined', handler);
}

/**
 * 워크스페이스 유저 퇴장
 * @param handler 핸들러
 */
export function onUserLeft(handler: (userId: string) => void) {
  socket.on('user:left', handler);
}

interface CursorMovedPayload {
  userId: string;
  x: number;
  y: number;
}

/**
 * 커서 이동
 * @param handler 핸들러
 */
export function onCursorMoved(handler: (payload: CursorMovedPayload) => void) {
  socket.on('cursor:moved', handler);
}

/**
 * 위젯 생성
 * @param handler 핸들러
 */
export function onWidgetCreated(handler: (payload: CreateWidgetData) => void) {
  socket.on('widget:created', handler);
}

/**
 * 위젯 업데이트
 * @param handler 핸들러
 */
export function onWidgetUpdated(handler: (payload: UpdateWidgetData) => void) {
  socket.on('widget:updated', handler);
}

interface WidgetDeletedPayload {
  widgetId: string;
}

/**
 * 위젯 삭제
 * @param handler 핸들러
 */
export function onWidgetDeleted(
  handler: (payload: WidgetDeletedPayload) => void,
) {
  socket.on('widget:deleted', handler);
}

/**
 * 위젯 레이아웃 업데이트
 * @param handler 핸들러
 */
export function onWidgetMoved(
  handler: (payload: UpdateWidgetLayoutData) => void,
) {
  socket.on('widget:moved', handler);
}

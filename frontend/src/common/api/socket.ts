import { io } from 'socket.io-client';
import type { User } from '@/common/types/user';

import {
  useWorkspaceInfoStore,
  useWorkspaceWidgetStore,
} from '@/common/store/workspace';

import useUserStore from '@/common/store/user';
import type { WidgetData } from '../types/widgetData';
import useCursorStore from '../store/cusor';
import type { Cursor } from '../types/cursor';
import { CURSOR_INITIAL_POSITION } from '../components/cursor/constants';

const socketUrl =
  import.meta.env.MODE === 'production'
    ? window.location.origin
    : 'http://localhost:3000';

export const socket = io(`${socketUrl}/workspace`, {
  transports: ['polling', 'websocket'],
});

/**
 * 사용자가 워크스페이스에 입장
 * @param currentUser 현재 유저
 */
export function joinRoom(currentUser: User) {
  const workspaceId = useWorkspaceInfoStore.getState().workspaceId;
  useUserStore.getState().setUser(currentUser);

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
 * 사용자가 워크스페이스에서 퇴장
 */
export function leaveRoom() {
  const workspaceId = useWorkspaceInfoStore.getState().workspaceId;
  const userId = useUserStore.getState().user?.id;

  if (!userId) {
    return;
  }

  socket.emit('user:leave', { workspaceId, userId });
}

// 워크스페이스에서 다른 유저 퇴장
socket.on('user:left', (userId) => {
  useCursorStore.getState().removeCursor(userId);
});

// 워크스페이스 유저 입장
interface UserJoinedPayload {
  allUsers: User[];
  allWidgets: WidgetData[];
}

socket.on('user:joined', (payload: UserJoinedPayload) => {
  const { setCursorList } = useCursorStore.getState();
  const { setWidgetList } = useWorkspaceWidgetStore.getState();
  setCursorList(
    payload.allUsers.map((user) => ({
      userId: user.id,
      nickname: user.nickname,
      color: user.color,
      x: CURSOR_INITIAL_POSITION.x,
      y: CURSOR_INITIAL_POSITION.y,
    })),
  );
  setWidgetList(payload.allWidgets);
});

/**
 * 마우스 커서 관련 소켓 이벤트
 */
// 커서 이동
socket.on('cursor:moved', (payload: Pick<Cursor, 'userId' | 'x' | 'y'>) => {
  const { userId, ...cursorPosition } = payload;
  const { updateCursorPosition } = useCursorStore.getState();
  updateCursorPosition(userId, cursorPosition);
});

export function emitCursorMove(x: number, y: number) {
  socket.emit('cursor:move', {
    userId: useUserStore.getState().user?.id,
    moveData: { x, y },
  });
}

// /**
//  * 위젯 생성
//  * @param handler 핸들러
//  */
// export function onWidgetCreated(handler: (payload: CreateWidgetData) => void) {
//   socket.on('widget:created', handler);
// }

// /**
//  * 위젯 업데이트
//  * @param handler 핸들러
//  */
// export function onWidgetUpdated(handler: (payload: UpdateWidgetData) => void) {
//   socket.on('widget:updated', handler);
// }

// interface WidgetDeletedPayload {
//   widgetId: string;
// }

// /**
//  * 위젯 삭제
//  * @param handler 핸들러
//  */
// export function onWidgetDeleted(
//   handler: (payload: WidgetDeletedPayload) => void,
// ) {
//   socket.on('widget:deleted', handler);
// }

// /**
//  * 위젯 레이아웃 업데이트
//  * @param handler 핸들러
//  */
// export function onWidgetMoved(
//   handler: (payload: UpdateWidgetLayoutData) => void,
// ) {
//   socket.on('widget:moved', handler);
// }

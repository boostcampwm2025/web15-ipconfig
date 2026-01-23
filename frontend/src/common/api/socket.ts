import { io } from 'socket.io-client';
import type { User } from '@/common/types/user';

import {
  useWorkspaceInfoStore,
  useWorkspaceWidgetStore,
} from '@/common/store/workspace';

import useUserStore from '@/common/store/user';
import type {
  WidgetContent,
  WidgetData,
  WidgetLayout,
  WidgetType,
} from '../types/widgetData';

const socketUrl =
  import.meta.env.VITE_BACKEND_URL ??
  (import.meta.env.MODE === 'production'
    ? window.location.origin
    : 'http://localhost:3000');

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
socket.on('user:left', () => {});

// 워크스페이스 유저 입장
interface UserJoinedPayload {
  allUsers: User[];
  allWidgets: {
    widgetId: string;
    type: WidgetType;
    data: { content: WidgetContent } & WidgetLayout;
  }[];
}

socket.on('user:joined', (payload: UserJoinedPayload) => {
  const { setWidgetList } = useWorkspaceWidgetStore.getState();
  // 커서는 awareness로 처리되므로 여기서는 위젯만 설정
  setWidgetList(
    payload.allWidgets.map((widget) => {
      const { widgetId, type, data } = widget;
      const { content, ...layout } = data;

      return {
        widgetId,
        type,
        layout,
        content,
      };
    }),
  );
});

// 위젯 생성 함수
export function emitCreateWidget(widgetData: WidgetData) {
  const { widgetId, type, layout, content } = widgetData;
  const data = { ...layout, content: { ...content, widgetType: type } };
  socket.emit('widget:create', {
    widgetId,
    type,
    data,
  });
}

// 다른 유저의 위젯 생성 반영
socket.on(
  'widget:created',
  (payload: {
    widgetId: string;
    type: WidgetType;
    data: WidgetLayout & { content: WidgetContent };
  }) => {
    const { createWidget } = useWorkspaceWidgetStore.getState();
    const { widgetId, type, data } = payload;
    const { content, ...layout } = data;
    createWidget({ widgetId, type, layout, content });
  },
);

// 위젯 업데이트
/**
 * 위젯 업데이트
 * @param widgetId 위젯 ID
 * @param payload 위젯 내용
 */
export function emitUpdateWidget(widgetId: string, payload: WidgetContent) {
  const widgetType = useWorkspaceWidgetStore
    .getState()
    .widgetList.find((widget) => widget.widgetId === widgetId)?.type;
  const content = widgetType
    ? ({ ...payload, widgetType } as WidgetContent)
    : payload;

  socket.emit('widget:update', {
    widgetId,
    data: {
      content,
    },
  });
  const { updateWidget } = useWorkspaceWidgetStore.getState();
  updateWidget(widgetId, { content });
}

// 다른 유저의 위젯 업데이트 반영
socket.on(
  'widget:updated',
  (payload: { widgetId: string; data: { content: WidgetContent } }) => {
    const { updateWidget } = useWorkspaceWidgetStore.getState();
    updateWidget(payload.widgetId, { content: payload.data.content });
  },
);

// 위젯 레이아웃 업데이트
export function emitUpdateWidgetLayout(
  widgetId: string,
  payload: WidgetLayout,
) {
  socket.emit('widget:move', {
    widgetId,
    data: payload,
  });
  const { updateWidget } = useWorkspaceWidgetStore.getState();
  updateWidget(widgetId, { layout: payload });
}

// 다른 유저의 위젯 레이아웃 업데이트 반영
socket.on(
  'widget:moved',
  (payload: { widgetId: string; data: WidgetLayout }) => {
    const { updateWidget } = useWorkspaceWidgetStore.getState();
    updateWidget(payload.widgetId, { layout: payload.data });
  },
);

// 위젯 삭제
export function emitDeleteWidget(widgetId: string) {
  socket.emit('widget:delete', {
    widgetId,
  });
}

// 다른 유저의 위젯 삭제 반영
socket.on('widget:deleted', (payload: { widgetId: string }) => {
  const { deleteWidget } = useWorkspaceWidgetStore.getState();
  deleteWidget(payload.widgetId);
});

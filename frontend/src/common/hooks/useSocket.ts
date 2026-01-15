import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type {
  WidgetContent,
  WidgetData,
  WidgetType,
  CreateWidgetData,
  UpdateWidgetData,
  UpdateWidgetLayoutData,
  MoveWidgetData,
} from '@/common/types/widgetData';
import type { User } from '@/common/types/user';
import type { Cursor } from '@/common/types/cursor';

// Remote cursor 상태 타입
type RemoteCursorState = {
  [userId: string]: Cursor;
};

interface UseSocketParams {
  workspaceId: string;
  currentUser: User;
  setRemoteCursors: React.Dispatch<React.SetStateAction<RemoteCursorState>>;
  setWidgets: React.Dispatch<React.SetStateAction<Record<string, WidgetData>>>;
}

export const useSocket = ({
  workspaceId,
  currentUser,
  setRemoteCursors,
  setWidgets,
}: UseSocketParams) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socketUrl =
      import.meta.env.MODE === 'production'
        ? window.location.origin
        : 'http://localhost:3000';

    const socket = io(`${socketUrl}/workspace`, {
      transports: ['polling', 'websocket'],
    });
    socketRef.current = socket;

    // 1) 유저 입장
    socket.emit('user:join', {
      workspaceId,
      user: {
        id: currentUser.id,
        nickname: currentUser.nickname,
        color: currentUser.color,
      },
    });

    // 2) 같은 workspace의 전체 유저 + 커서 목록 수신
    socket.on(
      'user:joined',
      (payload: {
        allUsers: {
          id: string;
          nickname: string;
          color: string;
          backgroundColor: string;
        }[];
        allWidgets: CreateWidgetData[];
      }) => {
        setRemoteCursors((prev) => {
          const next = { ...prev };

          payload.allUsers.forEach((user) => {
            next[user.id] = {
              userId: user.id,
              nickname: user.nickname,
              color: user.color,
              // 일단 아예 저 멀리 생성해서 안 보이도록 하기
              // 추후에 update-cursor 이벤트를 받으면 그 때 위치를 업데이트 해주기
              x: 10000,
              y: 10000,
            };
          });

          payload.allWidgets.forEach((widget) => {
            setWidgets((prev) => ({ ...prev, [widget.widgetId]: widget.data }));
          });

          return next;
        });
      },
    );

    // 3) 유저 퇴장
    socket.on('user:left', (userId: string) => {
      setRemoteCursors((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    });

    // 4) 커서 이동 브로드캐스트 수신
    socket.on(
      'cursor:moved',
      (payload: { userId: string; x: number; y: number }) => {
        const { userId, x, y } = payload;

        setRemoteCursors((prev) => {
          const existing = prev[userId];

          if (!existing) {
            // 아직 join 이벤트를 못 받은 유저라면 기본값으로 생성
            return {
              ...prev,
              [userId]: {
                userId,
                nickname: '임시 유저',
                color: '#3b82f6',
                backgroundColor: '#3b82f6',
                x,
                y,
              },
            };
          }
          return {
            ...prev,
            [userId]: {
              ...existing,
              x,
              y,
            },
          };
        });
      },
    );

    // 5) 위젯 생성
    socket.on('widget:created', (payload: CreateWidgetData) => {
      setWidgets((prev) => ({ ...prev, [payload.widgetId]: payload.data }));
    });

    // 6) 위젯 업데이트
    socket.on('widget:updated', (payload: UpdateWidgetData) => {
      setWidgets((prev) => {
        const next = { ...prev };
        if (next[payload.widgetId]) {
          next[payload.widgetId] = {
            ...next[payload.widgetId],
            content: payload.data.content,
          };
        }
        return next;
      });
    });

    // 7) 위젯 삭제
    socket.on('widget:deleted', (payload: { widgetId: string }) => {
      setWidgets((prev) => {
        const next = { ...prev };
        delete next[payload.widgetId];
        return next;
      });
    });

    // 8) 위젯 레이아웃 업데이트
    socket.on('widget:moved', (payload: UpdateWidgetLayoutData) => {
      setWidgets((prev) => {
        const next = { ...prev };
        if (next[payload.widgetId]) {
          next[payload.widgetId] = {
            ...next[payload.widgetId],
            ...payload.data,
          };
        }
        return next;
      });
    });

    return () => {
      socket.emit('user:leave', { workspaceId, userId: currentUser.id });
      socket.disconnect();
    };
  }, [workspaceId, currentUser, setRemoteCursors, setWidgets]);

  const emitCursorMove = (x: number, y: number) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit('cursor:move', {
      userId: currentUser.id,
      moveData: { x, y },
    });
  };

  const emitCreateWidget = (type: WidgetType, data: WidgetData) => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.emit('widget:create', {
      // 임시 UUID 생성해서 반환
      widgetId: crypto.randomUUID(),
      type,
      data,
    });
  };

  const emitUpdateWidget = (widgetId: string, data: WidgetContent) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit('widget:update', {
      widgetId,
      data: {
        content: data,
      },
    });

    setWidgets((prev) => {
      const next = { ...prev };
      if (next[widgetId]) {
        next[widgetId] = {
          ...next[widgetId],
          content: data,
        };
      }
      return next;
    });
  };

  const emitMoveWidget = (
    widgetId: string,
    { x, y, width, height, zIndex }: MoveWidgetData,
  ) => {
    const socket = socketRef.current;
    if (!socket) return;

    // 드래그한 클라이언트는 widget:moved 브로드캐스트를 받지 않으므로
    // 로컬 상태를 먼저 낙관적으로 업데이트한다.
    setWidgets((prev) => {
      const next = { ...prev };
      if (next[widgetId]) {
        next[widgetId] = {
          ...next[widgetId],
          x: x ?? next[widgetId].x,
          y: y ?? next[widgetId].y,
          width: width ?? next[widgetId].width,
          height: height ?? next[widgetId].height,
          zIndex: zIndex ?? next[widgetId].zIndex,
        };
      }
      return next;
    });

    socket.emit('widget:move', {
      widgetId,
      data: { x, y, width, height, zIndex },
    });
  };

  const emitDeleteWidget = (widgetId: string) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit('widget:delete', {
      widgetId,
    });
  };

  return {
    socketRef,
    emitCursorMove,
    emitCreateWidget,
    emitUpdateWidget,
    emitDeleteWidget,
    emitMoveWidget,
  };
};

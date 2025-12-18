import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Remote cursor 상태 타입
type RemoteCursorState = Record<
  string,
  {
    userId: string;
    nickname: string;
    color: string;
    backgroundColor: string;
    x: number;
    y: number;
  }
>;

interface CurrentUserInfo {
  id: string;
  nickname: string;
  color: string;
  backgroundColor: string;
}

interface UseSocketParams {
  workspaceId: string;
  currentUser: CurrentUserInfo;
  setRemoteCursors: React.Dispatch<React.SetStateAction<RemoteCursorState>>;
}

export const useSocket = ({
  workspaceId,
  currentUser,
  setRemoteCursors,
}: UseSocketParams) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000', {
      transports: ['websocket'],
    });
    socketRef.current = socket;

    // 1) 유저 입장
    socket.emit('user:join', {
      workspaceId,
      user: {
        id: currentUser.id,
        nickname: currentUser.nickname,
        color: currentUser.color,
        backgroundColor: currentUser.backgroundColor,
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
        cursors: {
          userId: string;
          workspaceId: string;
          x: number;
          y: number;
        }[];
      }) => {
        setRemoteCursors((prev) => {
          const next = { ...prev };

          const cursorMap = new Map(
            payload.cursors.map((cursor) => [cursor.userId, cursor]),
          );

          payload.allUsers.forEach((user) => {
            const existing = next[user.id];
            const cursor = cursorMap.get(user.id);

            next[user.id] = {
              userId: user.id,
              nickname: user.nickname,
              color: user.color,
              backgroundColor: user.backgroundColor,
              x: cursor?.x ?? existing?.x ?? 100,
              y: cursor?.y ?? existing?.y ?? 100,
            };
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
      (payload: { userId: string; moveData: { x: number; y: number } }) => {
        const { userId, moveData } = payload;

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
                x: moveData.x,
                y: moveData.y,
              },
            };
          }
          return {
            ...prev,
            [userId]: {
              ...existing,
              x: moveData.x,
              y: moveData.y,
            },
          };
        });
      },
    );

    return () => {
      socket.emit('user:leave', { workspaceId, userId: currentUser.id });
      socket.disconnect();
    };
  }, [workspaceId, currentUser, setRemoteCursors]);

  const emitCursorMove = (x: number, y: number) => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit('cursor:move', {
      userId: currentUser.id,
      moveData: { x, y },
    });
  };

  return { socketRef, emitCursorMove };
};

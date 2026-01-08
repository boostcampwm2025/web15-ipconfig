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
        backgroundColor: currentUser.backgroundColor,
      },
    });

    // 2) 같은 workspace의 전체 유저 + 커서 목록 수신
    socket.on(
      'user:joined',
      (
        payload: {
          id: string;
          nickname: string;
          color: string;
          backgroundColor: string;
        }[],
      ) => {
        setRemoteCursors((prev) => {
          const next = { ...prev };

          payload.forEach((user) => {
            next[user.id] = {
              userId: user.id,
              nickname: user.nickname,
              color: user.color,
              backgroundColor: user.backgroundColor,
              // 일단 아예 저 멀리 생성해서 안 보이도록 하기
              // 추후에 update-cursor 이벤트를 받으면 그 때 위치를 업데이트 해주기
              x: 10000,
              y: 10000,
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

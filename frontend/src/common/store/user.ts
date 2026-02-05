import { create } from 'zustand';
import type { User } from '@/common/types/user';
import { useShallow } from 'zustand/react/shallow';

interface UserStore {
  myId: string | null;
  userList: User[];
  setMyId: (myId: string | null) => void;
  setUserList: (userList: User[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  myId: null,
  userList: [],
  setMyId: (myId: string | null) => set({ myId }),
  setUserList: (userList: User[]) => set({ userList }),
}));

export const useMe = () =>
  useUserStore(useShallow((s) => s.userList.find((u) => u.id === s.myId)));

// 내 커서 타입
export const useMyCursorType = () =>
  useUserStore(
    useShallow((s) => s.userList.find((u) => u.id === s.myId)?.cursor.type),
  );

// 전체 유저 리스트(파생)
export const useUserList = () => useUserStore((s) => s.userList);

// 2. ID 리스트만 따로 관리하는 훅 (이 리스트는 커서가 움직여도 변하지 않음)
export const useUserIds = () =>
  useUserStore(useShallow((s) => s.userList.map((u) => u.id)));

// 3. 개별 유저의 정보만 가져오는 훅 (커서 제외)
export const useUserInfoById = (id: string) =>
  useUserStore(
    useShallow((s) => {
      const user = s.userList.find((u) => u.id === id);
      return user
        ? { id: user.id, nickname: user.nickname, color: user.color }
        : null;
    }),
  );

export const useMyId = () => useUserStore((s) => s.myId);

export const useUserCursorById = (userId: string) =>
  useUserStore((s) => s.userList.find((user) => user.id === userId)?.cursor);

// 나 제외 유저 리스트(파생)
export const useOtherUserList = () =>
  useUserStore(
    useShallow((s) =>
      s.userList.filter((user) => {
        return user.id !== s.myId;
      }),
    ),
  );

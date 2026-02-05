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

// 내 유저(파생)
export const useMe = () =>
  useUserStore(useShallow((s) => s.userList.find((u) => u.id === s.myId)));

// 내 커서 타입
export const useMyCursorType = () =>
  useUserStore(
    useShallow((s) => s.userList.find((u) => u.id === s.myId)?.cursor.type),
  );

// 전체 유저 리스트(파생)
export const useUserList = () => useUserStore((s) => s.userList);

// 나 제외 유저 리스트(파생)
export const useOtherUserList = () =>
  useUserStore(
    useShallow((s) =>
      s.userList.filter((user) => {
        return user.id !== s.myId;
      }),
    ),
  );

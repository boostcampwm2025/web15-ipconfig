import { create } from 'zustand';
import type { User } from '@/common/types/user';

interface UserStore {
  user: User;
  setUser: (user: User) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: {
    id: 'u1',
    nickname: 'user1',
    color: '#000000',
  },
  setUser: (user: User) => set({ user }),
}));

export default useUserStore;

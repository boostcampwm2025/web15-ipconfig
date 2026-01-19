import { create } from 'zustand';
import type { User } from '@/common/types/user';

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}));

export default useUserStore;

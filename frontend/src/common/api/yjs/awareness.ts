import { getProvider } from './instance';
import type { ManipulationState } from '@/common/types/user';

// 커서 움직임 (마우스 이동)
export const updateLocalCursor = (x: number, y: number) => {
  const provider = getProvider();
  if (provider && provider.awareness) {
    provider.awareness.setLocalStateField('cursor', {
      x,
      y,
      ts: Date.now(),
    });
  }
};

// 사용자의 위젯 선택 및 조작 시작/진행 (예시: 드래그 중)
export const updateUserManipulationState = (state: ManipulationState) => {
  const provider = getProvider();
  if (provider && provider.awareness) {
    provider.awareness.setLocalStateField('manipulationState', state);
  }
};

// 사용자의 위젯 선택 및 조작 종료 (예시: 드래그 끝)
export const clearUserManipulationState = () => {
  const provider = getProvider();
  if (provider && provider.awareness) {
    provider.awareness.setLocalStateField('manipulationState', null);
  }
};

// 닉네임 변경
export const updateUserNickname = (nickname: string) => {
  const provider = getProvider();
  if (provider && provider.awareness) {
    const currentUser = provider.awareness.getLocalState()?.user;
    if (currentUser) {
      provider.awareness.setLocalStateField('user', {
        ...currentUser,
        nickname,
      });
    }
  }
};

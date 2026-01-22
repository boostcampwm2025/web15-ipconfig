import type { EditingState, UserState } from '../../types/yjsawareness';
import { getProvider } from './instance';

// 내 정보 등록
export const setLocalUser = (user: UserState) => {
  const provider = getProvider();
  if (provider && provider.awareness) {
    provider.awareness.setLocalStateField('user', user);
  }
};

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

// 위젯 편집 시작/진행 (드래그 중 - 실시간 프리뷰 공유)
export const updateEditingState = (state: EditingState) => {
  const provider = getProvider();
  if (provider && provider.awareness) {
    provider.awareness.setLocalStateField('editing', state);
  }
};

// 위젯 편집 종료 (드래그 끝 - 프리뷰 제거)
export const clearEditingState = () => {
  const provider = getProvider();
  if (provider && provider.awareness) {
    provider.awareness.setLocalStateField('editing', null);
  }
};

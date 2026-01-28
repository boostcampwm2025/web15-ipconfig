import type {
  EditingState,
  LocalState,
  UserState,
} from '../../types/yjsawareness';
import { getProvider } from './instance';
import type { Awareness } from 'y-protocols/awareness';
import {
  type WidgetInteraction,
  useWidgetInteractionStore,
} from '../../store/widgetInteraction';

// 내 정보 등록
// export const setLocalUser = (user: UserState) => {
//   const provider = getProvider();
//   if (provider && provider.awareness) {
//     provider.awareness.setLocalStateField('user', user);
//   }
// };

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

// 위젯 인터랙션(이동/크기조절) 처리 - 로컬 + 리모트 모두 포함
export const handleWidgetInteractionChange = (awareness: Awareness) => {
  const states = awareness.getStates() as Map<number, LocalState>;
  const interactions: WidgetInteraction[] = [];

  states.forEach((state: LocalState) => {
    // user 정보와 editing 정보가 없으면 스킵
    if (!state.user || !state.editing) return;

    interactions.push({
      widgetId: state.editing.widgetId,
      user: state.user,
      x: state.editing.preview.x,
      y: state.editing.preview.y,
      width: state.editing.preview.width,
      height: state.editing.preview.height,
    });
  });

  // zustand store 업데이트 (로컬+리모트 통합)
  useWidgetInteractionStore.getState().setInteractions(interactions);
};

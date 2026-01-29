import * as Y from 'yjs';
import {
  HocuspocusProvider,
  type onAwarenessChangeParameters,
} from '@hocuspocus/provider';
import { initializeYDoc, initializeUserAwareness } from './utils/initialize';
import { useUserStore } from '@/common/store/user';

// Doc은 앱 실행 시 바로 생성 (싱글톤)
export const doc = new Y.Doc();

// Provider는 나중에 방(workspaceId)에 들어갈 때 초기화
let provider: HocuspocusProvider | null = null;
let currentWorkspaceId: string | null = null;

export const connectProvider = (workspaceId: string) => {
  // 같은 workspaceId면 재연결하지 않음
  if (provider && currentWorkspaceId === workspaceId) {
    return provider;
  }

  // 기존 Provider가 있으면 정리
  if (provider) {
    provider.destroy();
    provider = null;
    currentWorkspaceId = null;
  }

  const url = `${
    import.meta.env.MODE === 'production'
      ? window.location.origin
      : 'http://localhost:3000'
  }/collaboration`;

  try {
    provider = new HocuspocusProvider({
      url,
      name: `workspace:${workspaceId}`, // 방 이름
      document: doc,
      onSynced: () => {
        const root = doc.getMap('root');
        const isFirstTime = root.size === 0 || !root.has('schemaVersion');

        if (isFirstTime) {
          doc.transact(() => {
            initializeYDoc(doc, workspaceId);
          });
        }
      },
      onAwarenessChange({ states }: onAwarenessChangeParameters) {
        const setUserList = useUserStore.getState().setUserList;
        const userWithCursor = states.map(
          ({ user, cursor, manipulationState }) => ({
            ...user,
            cursor,
            manipulationState,
          }),
        );
        setUserList(userWithCursor);
      },
    });

    initializeUserAwareness(provider);
    currentWorkspaceId = workspaceId;
  } catch (error) {
    provider = null;
    currentWorkspaceId = null;
  }

  return provider;
};

export const getProvider = () => provider;

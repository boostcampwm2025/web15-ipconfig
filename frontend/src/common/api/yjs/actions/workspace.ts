import { doc } from '../instance';
import { getRootMap } from '../utils/getMaps';
import type * as Y from 'yjs';

// 워크스페이스 제목 수정
export const updateWorkspaceTitleAction = (newTitle: string) => {
  doc.transact(() => {
    const root = getRootMap();
    if (!root) return;

    const workspace = root.get('workspace') as Y.Map<unknown>;
    if (workspace) {
      workspace.set('title', newTitle);
    }
  });
};

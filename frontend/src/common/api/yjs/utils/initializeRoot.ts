import * as Y from 'yjs';

// 문서 초기화: 필수 공유 타입(Root, Widgets, WidgetOrder)이 존재하는지 확인하고 없으면 생성
export function initializeRoot(doc: Y.Doc, workspaceId: string) {
  const root = doc.getMap('root');

  if (!root.has('schemaVersion')) root.set('schemaVersion', 1);

  if (!root.has('workspace')) {
    const ws = new Y.Map();
    ws.set('id', workspaceId);
    ws.set('createdAt', Date.now());
    root.set('workspace', ws);
  }

  if (!root.has('widgets')) {
    root.set('widgets', new Y.Map());
  }

  if (!root.has('widgetOrder')) {
    root.set('widgetOrder', new Y.Array());
  }

  if (!root.has('meta')) {
    root.set('meta', new Y.Map());
  }

  return root;
}

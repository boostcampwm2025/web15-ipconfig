import { NotFoundException } from '@nestjs/common';
import * as Y from 'yjs';

import { YjsDocReaderService } from '../yjs-doc-reader.service';
import type { CollaborationService } from '../collaboration.service';
import type { YjsWidgetData } from '../types/yjs-widget.types';

type CollaborationServiceMock = {
  getDocument: jest.Mock<unknown, [string]>;
};

describe('YjsDocReaderService', () => {
  let service: YjsDocReaderService;
  let collaborationServiceMock: CollaborationServiceMock;

  const workspaceId = 'workspace-1';

  beforeEach(() => {
    collaborationServiceMock = {
      getDocument: jest.fn<unknown, [string]>(),
    };

    service = new YjsDocReaderService(
      collaborationServiceMock as unknown as CollaborationService,
    );
  });

  it('문서가 없으면 NotFoundException을 던진다', () => {
    collaborationServiceMock.getDocument.mockReturnValue(null);

    expect(() => service.getWidgets(workspaceId)).toThrow(NotFoundException);
  });

  it('widgets 맵이 없으면 빈 배열을 반환한다', () => {
    const doc = new Y.Doc();
    // root 맵만 존재하고 widgets 키는 없음
    doc.getMap('root');

    collaborationServiceMock.getDocument.mockReturnValue(doc);

    const widgets = service.getWidgets(workspaceId);

    expect(widgets).toEqual([]);
  });

  it('Y.Doc에서 widgets 데이터를 올바르게 변환한다 (직접 Y.Doc 사용)', () => {
    const doc = new Y.Doc();
    const root = doc.getMap('root');
    const widgetsMap = new Y.Map<Y.Map<unknown>>();
    root.set('widgets', widgetsMap);

    const widgetMap = new Y.Map<unknown>();
    const layoutMap = new Y.Map<number>();
    layoutMap.set('x', 10);
    layoutMap.set('y', 20);
    layoutMap.set('width', 400);
    layoutMap.set('height', 300);

    const contentMap = new Y.Map<unknown>();
    contentMap.set('title', 'My Widget');

    widgetMap.set('id', 'w1');
    widgetMap.set('type', 'TECH_STACK');
    widgetMap.set('layout', layoutMap);
    widgetMap.set('content', contentMap);
    widgetMap.set('createdAt', 1234567890);

    widgetsMap.set('w1', widgetMap);

    collaborationServiceMock.getDocument.mockReturnValue(doc);

    const widgets = service.getWidgets(workspaceId);

    const expected: YjsWidgetData = {
      widgetId: 'w1',
      type: 'TECH_STACK',
      layout: { x: 10, y: 20, width: 400, height: 300 },
      content: { title: 'My Widget' },
      createdAt: 1234567890,
    };

    expect(widgets).toHaveLength(1);
    expect(widgets[0]).toEqual(expected);
  });

  it('Hocuspocus 문서 wrapper 객체({ document })에서도 위젯을 읽어온다', () => {
    const doc = new Y.Doc();
    const root = doc.getMap('root');
    const widgetsMap = new Y.Map<Y.Map<unknown>>();
    root.set('widgets', widgetsMap);

    const widgetMap = new Y.Map<unknown>();
    widgetMap.set('id', 'w2');

    widgetsMap.set('w2', widgetMap);

    collaborationServiceMock.getDocument.mockReturnValue({
      document: doc,
    } as unknown);

    const widgets = service.getWidgets(workspaceId);

    expect(widgets).toHaveLength(1);
    expect(widgets[0].widgetId).toBe('w2');
  });
});

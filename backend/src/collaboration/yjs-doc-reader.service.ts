// TODO: Yjs(Y.Map, Y.Array) 등 외부 타입으로 인한 경고/에러 무시
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CollaborationService } from './collaboration.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as Y from 'yjs';
import { DEFAULT_WIDGET_LAYOUT } from './constants/collaboration.constants';
import type {
  YjsWidgetData,
  YjsWidgetType,
  YjsWidgetLayout,
} from './types/yjs-widget.types';

@Injectable()
export class YjsDocReaderService {
  constructor(
    private readonly collaborationService: CollaborationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * 워크스페이스의 모든 위젯 데이터를 가져옵니다.
   * @param workspaceId 워크스페이스 ID
   * @returns 위젯 데이터 배열 (Plain JSON)
   * @throws NotFoundException 문서가 로드되지 않은 경우
   */
  getWidgets(workspaceId: string): YjsWidgetData[] {
    const hocuspocusDoc = this.collaborationService.getDocument(workspaceId);

    if (!hocuspocusDoc) {
      throw new NotFoundException(
        `워크스페이스 ${workspaceId}의 문서가 로드되지 않았습니다. 클라이언트가 연결되어 있는지 확인해주세요.`,
      );
    }

    // Hocuspocus Document 객체에서 Y.Doc 추출
    const yjsDoc =
      (hocuspocusDoc as unknown as { document?: Y.Doc }).document ??
      (hocuspocusDoc as unknown as Y.Doc);
    const root = yjsDoc.getMap('root');
    const widgets = root.get('widgets') as Y.Map<Y.Map<unknown>>;

    if (!widgets) {
      this.logger.warn(`Workspace ${workspaceId}: widgets map not found`, {
        context: YjsDocReaderService.name,
      });
      return [];
    }

    return this.convertWidgetsToJSON(widgets);
  }

  /**
   * Y.Map<Y.Map> 형태의 위젯 데이터를 Plain JSON 배열로 변환
   */
  private convertWidgetsToJSON(
    widgets: Y.Map<Y.Map<unknown>>,
  ): YjsWidgetData[] {
    const result: YjsWidgetData[] = [];

    widgets.forEach((widgetMap, widgetId) => {
      const widgetData = this.convertWidgetToJSON(widgetId, widgetMap);
      result.push(widgetData);
    });

    return result;
  }

  /**
   * 단일 Y.Map 위젯을 Plain JSON으로 변환
   */
  private convertWidgetToJSON(
    widgetId: string,
    widgetMap: Y.Map<unknown>,
  ): YjsWidgetData {
    const layoutMap = widgetMap.get('layout') as Y.Map<number>;
    const contentMap = widgetMap.get('content') as Y.Map<unknown>;

    const layout: YjsWidgetLayout = layoutMap
      ? {
          x: layoutMap.get('x') ?? DEFAULT_WIDGET_LAYOUT.X,
          y: layoutMap.get('y') ?? DEFAULT_WIDGET_LAYOUT.Y,
          width: layoutMap.get('width') ?? DEFAULT_WIDGET_LAYOUT.WIDTH,
          height: layoutMap.get('height') ?? DEFAULT_WIDGET_LAYOUT.HEIGHT,
        }
      : {
          x: DEFAULT_WIDGET_LAYOUT.X,
          y: DEFAULT_WIDGET_LAYOUT.Y,
          width: DEFAULT_WIDGET_LAYOUT.WIDTH,
          height: DEFAULT_WIDGET_LAYOUT.HEIGHT,
        };

    return {
      widgetId: (widgetMap.get('id') as string) ?? widgetId,
      type: (widgetMap.get('type') as YjsWidgetType) ?? 'TECH_STACK',
      layout,
      content: contentMap ? this.yTypeToJSON(contentMap) : {},
      createdAt: (widgetMap.get('createdAt') as number) ?? Date.now(),
    };
  }

  /**
   * Y.Map/Y.Array를 재귀적으로 Plain JSON으로 변환
   */
  private yTypeToJSON(yValue: unknown): Record<string, unknown> {
    if (yValue instanceof Y.Map) {
      const map = yValue as Y.Map<unknown>;
      const result: Record<string, unknown> = {};
      map.forEach((value, key) => {
        result[key] = this.yTypeToJSON(value);
      });
      return result;
    }

    if (yValue instanceof Y.Array) {
      const arr = yValue as Y.Array<unknown>;
      return arr
        .toArray()
        .map((item) => this.yTypeToJSON(item)) as unknown as Record<
        string,
        unknown
      >;
    }

    // 원시 타입 그대로 반환
    return yValue as Record<string, unknown>;
  }
}

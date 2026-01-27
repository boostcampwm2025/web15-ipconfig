import { create } from 'zustand';
import type { WidgetData } from '@/common/types/widgetData';

interface WorkspaceInfo {
  workspaceId: string;
  workspaceName: string;
}

interface WorkspaceInfoStore {
  workspaceId: string;
  workspaceName: string;
  setWorkspaceId: (id: string) => void;
  setWorkspaceInfo: (workspaceInfo: WorkspaceInfo) => void;
}

// 워크스페이스 기본 정보 스토어
export const useWorkspaceInfoStore = create<WorkspaceInfoStore>((set) => ({
  workspaceId: '', // URL에서 동기화됨
  workspaceName: '',
  setWorkspaceId: (id: string) => set({ workspaceId: id }),
  setWorkspaceInfo: (workspaceInfo: WorkspaceInfo) => set({ ...workspaceInfo }),
}));

// 워크스페이스 내 위젯 데이터 스토어
interface WorkspaceWidgetsStore {
  widgetList: WidgetData[];
  setWidgetList: (widgetList: WidgetData[]) => void;
  createWidget: (payload: WidgetData) => void;
  updateWidget: (
    widgetId: string,
    payload: Partial<Omit<WidgetData, 'widgetId'>>,
  ) => void;
  deleteWidget: (widgetId: string) => void;
}

export const useWorkspaceWidgetStore = create<WorkspaceWidgetsStore>((set) => ({
  widgetList: [],
  setWidgetList: (widgetList: WidgetData[]) => set({ widgetList }),
  createWidget: (payload: WidgetData) =>
    set((state) => ({
      widgetList: [...state.widgetList, payload],
    })),
  updateWidget: (
    widgetId: string,
    payload: Partial<Omit<WidgetData, 'widgetId'>>,
  ) =>
    set((state) => ({
      widgetList: state.widgetList.map((widget) => {
        if (widget.widgetId !== widgetId) {
          return widget;
        }

        const nextLayout = payload.layout
          ? { ...widget.layout, ...payload.layout }
          : widget.layout;

        return {
          ...widget,
          ...payload,
          layout: nextLayout,
        };
      }),
    })),
  deleteWidget: (widgetId: string) =>
    set((state) => ({
      widgetList: state.widgetList.filter(
        (widget) => widget.widgetId !== widgetId,
      ),
    })),
}));

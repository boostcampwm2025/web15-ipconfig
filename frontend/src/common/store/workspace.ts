import { create } from 'zustand';
import type { WidgetData } from '@/common/types/widgetData';

interface WorkspaceInfo {
  workspaceId: string;
  workspaceName: string;
}

interface WorkspaceInfoStore {
  workspaceId: string;
  workspaceName: string;
  setWorkspaceInfo: (workspaceInfo: WorkspaceInfo) => void;
}

export const useWorkspaceInfoStore = create<WorkspaceInfoStore>((set) => ({
  workspaceId: 'w1', // 임시로 고정된 워크스페이스 / 사용자 정보 (실제 서비스에서는 라우팅/로그인 정보 사용)
  workspaceName: 'workspace1',
  setWorkspaceInfo: (workspaceInfo: WorkspaceInfo) => set({ ...workspaceInfo }),
}));

interface WorkspaceWidgetsStore {
  widgetList: WidgetData[];
  setWidgetList: (widgetList: WidgetData[]) => void;
}

export const useWorkspaceWidgetStore = create<WorkspaceWidgetsStore>((set) => ({
  widgetList: [],
  setWidgetList: (widgetList: WidgetData[]) => set({ widgetList }),
}));

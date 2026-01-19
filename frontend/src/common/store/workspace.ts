import { create } from 'zustand';

interface WorkspaceInfo {
  workspaceId: string;
  workspaceName: string;
}

interface WorkspaceStore {
  workspaceId: string;
  workspaceName: string;
  setWorkspaceInfo: (workspaceInfo: WorkspaceInfo) => void;
}

const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaceId: 'w1',
  workspaceName: 'workspace1',
  setWorkspaceInfo: (workspaceInfo: WorkspaceInfo) => set({ ...workspaceInfo }),
}));

export default useWorkspaceStore;

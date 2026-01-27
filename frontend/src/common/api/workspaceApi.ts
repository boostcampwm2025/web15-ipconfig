import { apiClient } from './apiClient';

export interface CreateWorkspaceResponse {
  workspaceId: string;
}

export const workspaceApi = {
  /**
   * 워크스페이스를 무작위 ID로 생성합니다 (make).
   * @returns 생성된 워크스페이스 ID
   */
  make: async (): Promise<string> => {
    const response =
      await apiClient.post<CreateWorkspaceResponse>('/workspace/make');
    return response.data.workspaceId;
  },
  /**
   * 특정 ID로 워크스페이스를 생성합니다 (make).
   * @param workspaceId 생성할 워크스페이스 ID
   * @returns 생성된 워크스페이스 ID
   * @throws ConflictException 이미 존재하는 경우
   */
  makeWithId: async (workspaceId: string): Promise<string> => {
    const response = await apiClient.post<CreateWorkspaceResponse>(
      `/workspace/make/${workspaceId}`,
    );
    return response.data.workspaceId;
  },
  /**
   * 기존 워크스페이스에 참가합니다 (join).
   * @param workspaceId 참가할 워크스페이스 ID
   * @returns 워크스페이스 ID
   * @throws NotFoundException 워크스페이스가 존재하지 않는 경우
   */
  join: async (workspaceId: string): Promise<string> => {
    const response = await apiClient.get<CreateWorkspaceResponse>(
      `/workspace/join/${workspaceId}`,
    );
    return response.data.workspaceId;
  },
};

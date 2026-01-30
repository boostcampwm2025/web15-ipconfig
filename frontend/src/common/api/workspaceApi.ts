import type { AxiosRequestConfig } from 'axios';
import { apiClient } from './apiClient';

export interface CreateWorkspaceResponse {
  workspaceId: string;
}
// id 가 없으면, 무작위 ID로 생성
export type CreateWorkspaceRequest = Partial<CreateWorkspaceResponse>;

export interface JoinWorkspaceResponse {
  workspaceId: string;
  nickname: string;
}

export interface CheckWorkspaceResponse {
  exists: boolean;
}

export const workspaceApi = {
  /**
   * 워크스페이스를 무작위 ID로 생성합니다 (make).
   * @param workspaceId 생성할 워크스페이스 ID (선택 사항)
   * @returns 생성된 워크스페이스 ID
   */
  create: async (
    request: CreateWorkspaceRequest,
  ): Promise<CreateWorkspaceResponse> => {
    const response = await apiClient.post<CreateWorkspaceResponse>(
      '/workspace',
      request,
    );
    return response.data;
  },
  /**
   * 기존 워크스페이스에 참가합니다 (join).
   * @param workspaceId 참가할 워크스페이스 ID
   * @returns 워크스페이스 ID
   * @throws NotFoundException 워크스페이스가 존재하지 않는 경우
   */
  join: async (
    workspaceId: string,
    config?: AxiosRequestConfig,
  ): Promise<JoinWorkspaceResponse> => {
    const response = await apiClient.post<JoinWorkspaceResponse>(
      `/workspace/join`,
      { workspaceId },
      config,
    );
    return response.data;
  },

  /**
   * 워크스페이스 존재 여부 조회
   * @param workspaceId 조회할 워크스페이스 ID
   * @returns 워크스페이스 존재 여부
   */
  get: async (workspaceId: string): Promise<CheckWorkspaceResponse> => {
    const response = await apiClient.get<CheckWorkspaceResponse>(
      `/workspace/check/${workspaceId}`,
    );
    return response.data;
  },
};

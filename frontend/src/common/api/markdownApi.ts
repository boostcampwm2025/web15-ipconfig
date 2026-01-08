import { apiClient } from './apiClient';

export interface GetMarkdownResponse {
  markdown: string;
}

export const markdownApi = {
  /**
   * 워크스페이스 ID로 마크다운 문서를 생성합니다.
   * @param workspaceId 워크스페이스 ID
   * @returns 생성된 마크다운 문서
   */
  getMarkdown: async (workspaceId: string): Promise<string> => {
    const response = await apiClient.get<GetMarkdownResponse>('/markdown', {
      params: { workspaceId },
    });
    return response.data.markdown;
  },
};

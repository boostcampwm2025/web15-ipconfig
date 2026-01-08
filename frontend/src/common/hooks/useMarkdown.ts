import { useState, useCallback } from 'react';
import { markdownApi } from '../api/markdownApi';

interface UseMarkdownReturn {
  markdown: string;
  fetchMarkdown: (workspaceId: string) => Promise<void>;
}

/**
 * 마크다운 문서를 가져오고 관리하는 hook
 */
export const useMarkdown = (): UseMarkdownReturn => {
  const [markdown, setMarkdown] = useState<string>('');

  const fetchMarkdown = useCallback(async (workspaceId: string) => {
    const markdownData = await markdownApi.getMarkdown(workspaceId);
    setMarkdown(markdownData);
  }, []);

  return {
    markdown,
    fetchMarkdown,
  };
};

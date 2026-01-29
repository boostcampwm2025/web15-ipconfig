import { useState, useCallback } from 'react';
import { markdownApi } from '../api/markdownApi';
import { toast } from 'sonner';

export interface UseMarkdownReturn {
  markdown: string;
  fetchMarkdown: (workspaceId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

/**
 * 마크다운 문서를 가져오고 관리하는 hook
 */
export function useMarkdown(): UseMarkdownReturn {
  const [markdown, setMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMarkdown = useCallback(async (workspaceId: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const markdownData = await markdownApi.getMarkdown(workspaceId);
      setMarkdown(markdownData);
    } catch (error) {
      const errorMessage =
        (error as Error).message ?? '알 수 없는 오류가 발생했어요.';
      setError(errorMessage);
      toast.error('마크다운 가져오기에 실패했어요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    markdown,
    fetchMarkdown,
    isLoading,
    error,
  };
}

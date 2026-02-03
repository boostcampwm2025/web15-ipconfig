import { z } from 'zod';

export const searchTeckStackSchema = z.object({
  search: z.string().max(20, '검색어는 20자 이하여야 합니다.').trim(),
});

export type SearchTeckStack = z.infer<typeof searchTeckStackSchema>;

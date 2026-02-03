import { z } from 'zod';

export const workspaceSchema = z.object({
  title: z
    .string()
    .min(1, '워크스페이스 이름을 입력해주세요.')
    .max(20, '워크스페이스 이름은 20자 이하여야 합니다.')
    .trim(),
});

export type WorkspaceSchema = z.infer<typeof workspaceSchema>;

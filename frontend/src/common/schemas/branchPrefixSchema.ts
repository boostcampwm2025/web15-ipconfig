import { z } from 'zod';

export const branchPrefixSchema = z
  .object({
    prefix: z.string().max(20, '접두사(prefix)는 20자 이하여야 합니다.').trim(),
  })
  .required();

export type BranchPrefix = z.infer<typeof branchPrefixSchema>;

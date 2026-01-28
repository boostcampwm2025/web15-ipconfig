import { z } from 'zod';

export const createInviteCodeSchema = z.object({
  code: z
    .string()
    .max(32, '코드는 32자 이하여야 합니다.')
    .regex(/^[a-z0-9]*$/, '영소문자와 숫자만 입력 가능합니다.')
    .trim()
    .optional(),
});

export type CreateInviteCode = z.infer<typeof createInviteCodeSchema>;

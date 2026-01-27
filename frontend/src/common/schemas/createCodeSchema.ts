import { z } from 'zod';

export const createCodeSchema = z.object({
  code: z
    .string()
    .max(32, '코드는 32자 이하여야 합니다.')
    .regex(/^[a-z0-9]*$/, '영소문자와 숫자만 입력 가능합니다.') // 빈 문자열 허용 (*)
    .trim()
    .optional(),
});

export type CreateCode = z.infer<typeof createCodeSchema>;

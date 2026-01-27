import { z } from 'zod';

export const joinCodeSchema = z.object({
  code: z
    .string()
    .min(1, '코드를 입력해주세요.')
    .max(32, '코드는 32자 이하여야 합니다.')
    .trim()
    .regex(/^[a-z0-9]*$/, '영소문자와 숫자만 입력 가능합니다.'),
});

export type JoinCode = z.infer<typeof joinCodeSchema>;

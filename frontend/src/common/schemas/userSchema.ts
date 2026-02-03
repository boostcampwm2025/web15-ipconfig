import { z } from 'zod';

export const userSchema = z.object({
  nickname: z
    .string()
    .min(1, '닉네임을 입력해주세요.')
    .max(10, '닉네임은 10자 이하여야 합니다.')
    .trim(),
});

export type UserSchema = z.infer<typeof userSchema>;

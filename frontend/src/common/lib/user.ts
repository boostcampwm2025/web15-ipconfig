import { getRandomColor } from '@/utils/color';

export const generateCurrentUser = () => {
  const randomNickname = Math.floor(Math.random() * 10000);

  return {
    id: crypto.randomUUID(),
    nickname: `임시 유저 ${randomNickname}`,
    color: getRandomColor(),
    backgroundColor: getRandomColor(),
  };
};

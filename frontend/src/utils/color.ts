// color 값을 밝게 계산
export const getBrightenedColor = (
  hexColor: string,
  amount: number = 5,
): string => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const newR = Math.min(255, Math.round(r * amount));
  const newG = Math.min(255, Math.round(g * amount));
  const newB = Math.min(255, Math.round(b * amount));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
};

// 랜덤 색상 생성
export const getRandomColor = (): string => {
  const randomInt = Math.floor(Math.random() * 0xffffff);

  const hex = randomInt.toString(16).padStart(6, '0');

  return `#${hex}`;
};

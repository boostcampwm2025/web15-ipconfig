export const getRandomColor = (): string => {
  const randomInt = Math.floor(Math.random() * 0xffffff);

  const hex = randomInt.toString(16).padStart(6, '0');

  return `#${hex}`;
};

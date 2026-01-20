export const throttle = <Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
) => {
  let timerId: NodeJS.Timeout | null = null;

  return (...args: Args) => {
    if (timerId) return;
    timerId = setTimeout(() => {
      callback(...args);
      timerId = null;
    }, delay);
  };
};

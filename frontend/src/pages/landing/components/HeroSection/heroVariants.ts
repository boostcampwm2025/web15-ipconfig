export const FADE_UP = {
  show: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.35 },
      y: { type: 'spring' as const, stiffness: 400, damping: 30 },
    },
  },
  hidden: { opacity: 0, y: 20 },
};

export const BLUR_IN = {
  hidden: { filter: 'blur(20px)' },
  show: {
    filter: 'blur(0px)',
    transition: { duration: 1.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export const pullupVariant = {
  initial: { y: 12, opacity: 0 },
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.028,
      type: 'spring' as const,
      stiffness: 200,
      damping: 28,
    },
  }),
};

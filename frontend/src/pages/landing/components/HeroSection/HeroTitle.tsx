import { cn } from '@/common/lib/utils';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { FADE_UP, pullupVariant } from './heroVariants';

function HeroTitle() {
  const titleLetters = '우리 팀의 0번째 스프린트'.split('');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleIsInView = useInView(titleRef, { once: true });

  return (
    <motion.h1
      ref={titleRef}
      variants={FADE_UP}
      className="text-4xl leading-tight font-[1000] md:text-5xl"
    >
      {titleLetters.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={cn(
            'mx-[0.3px] inline-block whitespace-pre',
            word === '0' && 'text-primary',
          )}
          variants={pullupVariant}
          initial="initial"
          animate={titleIsInView ? 'animate' : ''}
          custom={i}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

export default HeroTitle;

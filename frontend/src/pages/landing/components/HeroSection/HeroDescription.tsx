import { cn } from '@/common/lib/utils';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { FADE_UP, pullupVariant } from './heroVariants';

const DESCRIPTION_TEXT =
  '프로젝트를 시작할 때 논의해야 하는 다양한 주제를\n위젯으로 쉽게 합의하고, 결과를 자동으로 문서화하세요';

function HeroDescription() {
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const descriptionLetters = DESCRIPTION_TEXT.split('');
  const descriptionIsInView = useInView(descriptionRef, { once: true });

  return (
    <motion.p
      ref={descriptionRef}
      className="text-muted-foreground mx-auto mb-8 max-w-2xl font-medium"
      variants={FADE_UP}
    >
      {descriptionLetters.map((word, i) => {
        if (word === '\n') return <br key={`${word}-${i}`} />;
        return (
          <motion.span
            key={`${word}-${i}`}
            className={cn('inline-block whitespace-pre')}
            variants={pullupVariant}
            initial="initial"
            animate={descriptionIsInView ? 'animate' : ''}
            custom={i}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.p>
  );
}

export default HeroDescription;

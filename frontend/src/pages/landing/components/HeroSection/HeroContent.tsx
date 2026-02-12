import { motion, stagger, useInView } from 'motion/react';
import { useRef } from 'react';
import HeroDescription from './HeroDescription';
import HeroServiceName from './HeroServiceName';
import HeroTitle from './HeroTitle';
import { BLUR_IN } from './heroVariants';
import JoinBadge from './JoinBadge';

function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  return (
    <motion.div ref={containerRef}>
      <motion.div
        variants={BLUR_IN}
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
      >
        <motion.div
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          variants={{
            hidden: {},
            show: {
              transition: {
                delayChildren: stagger(0.3),
              },
            },
          }}
          className="flex flex-col items-center justify-center"
        >
          <JoinBadge />
          <HeroTitle />
          <HeroServiceName />
          <HeroDescription />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default HeroContent;

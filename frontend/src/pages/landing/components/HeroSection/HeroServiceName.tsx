import { cn } from '@/common/lib/utils';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { FADE_UP, pullupVariant } from './heroVariants';

function HeroServiceName() {
  const serviceName = 'team.config'.split('');
  const serviceNameRef = useRef<HTMLParagraphElement>(null);
  const serviceNameIsInView = useInView(serviceNameRef, { once: true });

  return (
    <motion.p
      className="mb-4 text-4xl leading-tight font-[1000] md:text-5xl"
      ref={serviceNameRef}
      variants={FADE_UP}
    >
      {serviceName.map((name, i) => (
        <motion.span
          key={`${name}-${i}`}
          className={cn(i > 4 && 'text-primary')}
          variants={pullupVariant}
          initial="initial"
          animate={serviceNameIsInView ? 'animate' : ''}
          custom={i}
        >
          {name}
        </motion.span>
      ))}
    </motion.p>
  );
}

export default HeroServiceName;

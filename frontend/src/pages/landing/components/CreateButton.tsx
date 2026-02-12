import { ArrowRight } from 'lucide-react';
import { Button } from '@/common/components/shadcn/button';
import { motion } from 'motion/react';
import { useCreateWorkspace } from '@/common/hooks/useCreateWorkspace';
import { cn } from '@/common/lib/utils';

interface CreateButtonProps {
  label?: string;
  animation?: boolean;
  className?: string;
}

function CreateButton({
  label = '새 워크스페이스로 시작하기',
  animation = true,
  className,
}: CreateButtonProps) {
  const { handleSubmit, onSubmit } = useCreateWorkspace();

  if (!animation) {
    return (
      <Button
        variant="default"
        size="lg"
        onClick={handleSubmit(onSubmit)}
        className={cn('text-md font-bold md:text-lg', className)}
      >
        {label}
        <ArrowRight className="size-5" />
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <Button
        variant="default"
        size="lg"
        onClick={handleSubmit(onSubmit)}
        className={cn('text-md font-bold md:text-lg', className)}
      >
        {label}
        <ArrowRight className="size-5" />
      </Button>
    </motion.div>
  );
}

export default CreateButton;

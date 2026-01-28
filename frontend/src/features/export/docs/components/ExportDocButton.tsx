import { Button } from '@/common/components/shadcn/button';
import type { ComponentProps } from 'react';
import { LuFileText } from 'react-icons/lu';

function ExportDocButton({ ...props }: ComponentProps<typeof Button>) {
  return (
    <Button className="bg-primary-700 font-semibold text-white" {...props}>
      <LuFileText size={16} />
      문서 내보내기
    </Button>
  );
}

export default ExportDocButton;

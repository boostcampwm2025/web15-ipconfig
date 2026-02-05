import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '@/common/components/shadcn/item';
import { SUBJECT_GUIDELINES } from '@/features/widgets/techStack/constant/subject';
import { SparklesIcon } from 'lucide-react';

function SubjectGuideline({ category }: { category: string }) {
  const guideline = SUBJECT_GUIDELINES[category];

  if (!guideline) {
    return null;
  }

  return (
    <Item variant="outline" className="border-primary/70 max-w-full">
      <ItemMedia>
        <SparklesIcon className="text-primary size-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{category}</ItemTitle>
        <ItemDescription className="line-clamp-none text-pretty wrap-break-word whitespace-pre-wrap">
          {guideline}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

export default SubjectGuideline;

import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '@/common/components/shadcn/item';
import { SUBJECT_GUIDELINES } from '@/features/widgets/techStack/constant/subject';
import { SparklesIcon } from 'lucide-react';

function SubjectGuideline({
  category,
  option,
}: {
  category: string;
  option: string;
}) {
  const guideline = SUBJECT_GUIDELINES[category]?.[option];

  if (!guideline) {
    return null;
  }

  return (
    <Item
      variant="outline"
      className="border-primary/70 animate-in fade-in max-w-full duration-500"
    >
      <ItemMedia>
        <SparklesIcon className="text-primary size-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          [{category}] {option}
        </ItemTitle>
        <ItemDescription className="line-clamp-none text-pretty wrap-break-word">
          {guideline}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

export default SubjectGuideline;

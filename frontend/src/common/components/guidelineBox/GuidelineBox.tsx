import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/common/components/shadcn/item';
import { SparklesIcon } from 'lucide-react';

interface GuidelineBoxProps {
  category: string;
  description: string;
  recommendation?: string;
}

export function GuidelineBox({
  category,
  description,
  recommendation,
}: GuidelineBoxProps) {
  return (
    <Item
      variant="outline"
      className="border-primary/70 animate-in fade-in max-w-full duration-500"
    >
      <ItemMedia>
        <SparklesIcon className="text-primary size-4" />
      </ItemMedia>
      <ItemContent className="animate-in fade-in">
        <ItemTitle className="mb-2">[{category}] 팁</ItemTitle>
        {recommendation && (
          <ItemDescription className="mb-0.5 line-clamp-none rounded-md bg-gray-900/80 p-4 text-xs text-pretty break-keep text-gray-300">
            추천: {recommendation}
          </ItemDescription>
        )}
        <ItemDescription className="line-clamp-none text-pretty break-keep">
          {description}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

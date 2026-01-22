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
}

export function GuidelineBox({ category, description }: GuidelineBoxProps) {
  return (
    <Item
      variant="outline"
      className="border-primary/70 animate-in fade-in max-w-full duration-500"
    >
      <ItemMedia>
        <SparklesIcon className="text-primary size-4" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>[{category}] 팁</ItemTitle>
        <ItemDescription className="line-clamp-none text-pretty wrap-break-word">
          {description}
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

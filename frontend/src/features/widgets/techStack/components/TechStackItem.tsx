import { memo, useState } from 'react';
import { getTechIconUrl } from '@/features/widgets/techStack/utils/getTechIconUrl';
import { Badge } from '@/common/components/shadcn/badge';

interface TechIconProps {
  slug: string;
  color: string;
}

function TechIcon({ slug, color }: TechIconProps) {
  const [error, setError] = useState(false);
  const iconUrl = getTechIconUrl(slug, color);

  if (error) {
    return (
      <Badge className="h-5 w-5 rounded-full bg-gray-200 font-bold text-gray-600">
        {slug.substring(0, 1)}
      </Badge>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={slug}
      className="h-5 w-5 object-contain"
      onError={() => setError(true)}
    />
  );
}

interface TechStackItemProps {
  name: string;
  slug: string;
  color: string;
}

export function TechStackItem({ name, slug, color }: TechStackItemProps) {
  return (
    <Badge
      variant="outline"
      className="hover:border-primary bg-card hover:bg-accent flex h-25.5 w-25.5 flex-col items-center justify-center gap-2 rounded-lg px-2 py-1 transition-colors select-none"
    >
      <TechIcon slug={slug} color={color} />
      <div className="text-muted-foreground text-center text-xs font-medium text-wrap">
        {name}
      </div>
    </Badge>
  );
}

export default memo(TechStackItem);

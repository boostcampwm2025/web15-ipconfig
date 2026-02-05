import { memo, useState } from 'react';
import { getTechIconUrl } from '@/features/widgets/techStack/utils/getTechIconUrl';
import { Badge } from '@/common/components/shadcn/badge';

interface TechIconProps {
  name: string;
}

function TechIcon({ name }: TechIconProps) {
  const [error, setError] = useState(false);
  const iconUrl = getTechIconUrl(name);

  if (error) {
    return (
      <Badge className="bg-muted text-muted-foreground h-5 w-5 rounded-full font-bold">
        {name.substring(0, 1)}
      </Badge>
    );
  }

  return (
    <img
      src={iconUrl}
      alt={name}
      className="h-5 w-5 object-contain"
      onError={() => setError(true)}
    />
  );
}

export function TechStackItem({ techName }: { techName: string }) {
  return (
    <Badge
      variant="outline"
      className="hover:border-primary bg-card hover:bg-accent flex h-25.5 w-25.5 flex-col items-center justify-center gap-2 rounded-lg px-2 py-1 transition-colors select-none"
    >
      <TechIcon name={techName} />
      <div className="text-card-foreground text-center text-xs font-medium text-wrap">
        {techName}
      </div>
    </Badge>
  );
}

export default memo(TechStackItem);

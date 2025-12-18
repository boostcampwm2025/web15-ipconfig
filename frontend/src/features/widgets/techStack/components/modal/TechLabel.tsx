import { memo, useState } from 'react';
import { getTechIconUrl } from '../../utils/getTechIconUrl';
import { Badge } from '@/components/ui/badge';

const TechIcon = ({ name }: { name: string }) => {
  const [error, setError] = useState(false);
  const iconUrl = getTechIconUrl(name);

  if (error) {
    // 이미지가 없으면 텍스트(첫 글자)로 보여줌
    return (
      <Badge className="h-5 w-5 rounded-full bg-gray-200 font-bold text-gray-600">
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
};

function TechLabel({ techName }: { techName: string }) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('techName', techName);
  };

  return (
    <Badge
      variant="outline"
      className="hover:border-main mb-2 cursor-pointer gap-2 rounded-lg border-gray-700 px-2 py-1 select-none hover:bg-gray-700"
      draggable={true}
      onDragStart={handleDragStart}
    >
      <TechIcon name={techName} />
      <span className="text-sm font-medium text-gray-300">{techName}</span>
    </Badge>
  );
}

export default memo(TechLabel);

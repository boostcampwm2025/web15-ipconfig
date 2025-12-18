import { memo, useState } from 'react';
import { getTechIconUrl } from '../../utils/getTechIconUrl';

const TechIcon = ({ name }: { name: string }) => {
  const [error, setError] = useState(false);
  const iconUrl = getTechIconUrl(name);

  if (error) {
    // 이미지가 없으면 텍스트(첫 글자)로 보여줌
    return (
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
        {name.substring(0, 1)}
      </div>
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
    <div
      className="mb-4 flex cursor-pointer items-center gap-2 rounded-lg border border-gray-700 px-2 py-1 select-none hover:border-blue-500 hover:bg-gray-700"
      draggable={true}
      onDragStart={handleDragStart}
    >
      <TechIcon name={techName} />
      <span className="text-sm font-medium text-gray-300">{techName}</span>
    </div>
  );
}

export default memo(TechLabel);

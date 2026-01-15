import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

export default function SortableTag({
  id,
  name,
  onDelete,
}: {
  id: string;
  name: string;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(name);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex cursor-grab items-center gap-2 rounded-md border border-gray-700 bg-[#222] px-3 py-1 select-none"
    >
      {editMode ? (
        <input
          autoFocus
          className="border-b border-gray-600 bg-transparent text-gray-200 focus:outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            setEditMode(false);
            onDelete(id);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditMode(false);
              onDelete(id);
            }
          }}
        />
      ) : (
        <span
          onDoubleClick={() => setEditMode(true)}
          className="text-sm text-gray-200"
        >
          {name}
        </span>
      )}

      <button
        className="text-gray-400 hover:text-red-400"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}
      >
        ✕
      </button>
    </div>
  );
}

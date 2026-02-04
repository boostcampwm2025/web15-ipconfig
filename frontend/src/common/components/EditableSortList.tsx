import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import SortableTag from './SortableTag';
import { Button } from '@/common/components/shadcn/button';
import { useState } from 'react';

export default function EditableSortList() {
  const [isAdding, setIsAdding] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [columns, setColumns] = useState<{ id: string; name: string }[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setColumns((prev) => {
        const oldIndex = prev.findIndex((c) => c.id === active.id);
        const newIndex = prev.findIndex((c) => c.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };
  const addColumn = () => {
    if (!newColumnName.trim()) return;

    setColumns((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: newColumnName,
      },
    ]);

    setNewColumnName('');
    setIsAdding(false);
  };

  const deleteColumn = (id: string) => {
    setColumns((prev) => prev.filter((col) => col.id !== id));
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map((c) => c.id)}
            strategy={rectSortingStrategy}
          >
            {columns.map((col) => (
              <SortableTag
                key={col.id}
                id={col.id}
                name={col.name}
                onDelete={deleteColumn}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {!isAdding ? (
        <Button
          variant="ghost"
          onClick={() => setIsAdding(true)}
          className="text-primary mt-4 text-sm"
        >
          + 추가
        </Button>
      ) : (
        <div className="mt-4 flex items-center gap-2">
          <input
            autoFocus
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addColumn()}
            className="focus:ring-primary flex-1 rounded-md border border-gray-700 p-2 focus:ring-1 focus:outline-none"
            placeholder="이름 입력"
          />
          <Button onClick={addColumn}>생성</Button>
          <Button
            onClick={() => {
              setNewColumnName('');
              setIsAdding(false);
            }}
            className="bg-gray-700 text-gray-300"
          >
            취소
          </Button>
        </div>
      )}
    </div>
  );
}

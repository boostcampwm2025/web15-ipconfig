import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/shadcn/select';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import CounterInput from './CounterInput';
import { Button } from '@/common/components/shadcn/button';
import SortableTag from './SortableTag';

export default function TaskWorkflow() {
  const platforms = ['GitHub Projects', 'Jira', 'Linear', 'Notion'];

  // 스프린트
  const [cycleValue, setCycleValue] = useState<number>(2);
  const [editCycleValue, setEditCycleValue] = useState<boolean>(false);
  const [cycleUnit, setCycleUnit] = useState('week');

  // 상태 단계
  const [columns, setColumns] = useState([
    { id: 'backlog', name: '백로그' },
    { id: 'todo', name: '할 일' },
    { id: 'progress', name: '진행 중' },
    { id: 'review', name: '리뷰 중' },
    { id: 'done', name: '완료' },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');

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
    <div className="max-w-[400px] rounded-2xl border border-gray-700 p-6 text-gray-200">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        작업 관리
      </h2>

      <div className="mt-6">
        <p className="mb-2 text-sm">사용 플랫폼</p>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="사용 플랫폼 선택" />
          </SelectTrigger>
          <SelectContent>
            {platforms.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <p className="flex-1 text-sm">스프린트 주기</p>

        <CounterInput
          value={cycleValue}
          setValue={setCycleValue}
          editValue={editCycleValue}
          setEditValue={setEditCycleValue}
        />

        <Select value={cycleUnit} onValueChange={setCycleUnit}>
          <SelectTrigger className="w-16">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">일</SelectItem>
            <SelectItem value="week">주</SelectItem>
            <SelectItem value="month">월</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8">
        <p className="mb-2 text-sm">상태 단계</p>

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
          <button
            onClick={() => setIsAdding(true)}
            className="text-primary mt-4 cursor-pointer text-sm"
          >
            + 단계 추가
          </button>
        ) : (
          <div className="mt-4 flex items-center gap-2">
            <input
              autoFocus
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addColumn()}
              className="focus:ring-primary flex-1 rounded-md border border-gray-700 p-2 focus:ring-1 focus:outline-none"
              placeholder="단계 이름 입력"
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
    </div>
  );
}

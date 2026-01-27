import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/shadcn/select';

import CounterInput from './CounterInput';
import { platforms } from '../constants/options';
import type { CollaborationData } from '../types/CollaborationData';

interface TaskWorkflowProps {
  data: CollaborationData['workflow'];
  onUpdate: (
    key: keyof CollaborationData['workflow'],
    value: string | number,
  ) => void;
}

export default function TaskWorkflow({ data, onUpdate }: TaskWorkflowProps) {
  const [editCycleValue, setEditCycleValue] = useState<boolean>(false);

  return (
    <div className="max-w-[400px] rounded-2xl border border-gray-700 p-6 text-gray-200">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        작업 관리
      </h2>

      <div className="mt-6">
        <p className="mb-2 text-sm">사용 플랫폼</p>
        <Select
          value={data.platform?.selectedId}
          onValueChange={(value) => onUpdate('platform', value)}
        >
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
          value={data.cycleValue}
          setValue={(value) => onUpdate('cycleValue', value as number)}
          editValue={editCycleValue}
          setEditValue={setEditCycleValue}
          max={100}
        />

        <Select
          value={data.cycleUnit}
          onValueChange={(value) => onUpdate('cycleUnit', value)}
        >
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
    </div>
  );
}

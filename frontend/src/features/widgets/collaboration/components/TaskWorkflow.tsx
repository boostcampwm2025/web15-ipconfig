import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/components/shadcn/select';
import SelectInput from '@/common/components/SelectInput';

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
    <div className="border-border text-foreground max-w-[400px] rounded-2xl border p-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold">
        작업 관리
      </h2>

      <div className="mt-6">
        <p className="mb-2 text-sm">사용 플랫폼</p>
        <SelectInput
          selectedValue={
            data.platform?.selectedId
              ? `[Platform] ${data.platform.selectedId}`
              : ''
          }
          setSelectedValue={(value) => {
            // [Platform] Jira -> Jira
            const match = value.match(/^\[(.*?)\] (.*)$/);
            if (match) {
              onUpdate('platform', match[2]);
            } else {
              onUpdate('platform', value);
            }
          }}
          customOptions={[
            ...platforms.map((p) => `[Platform] ${p}`),
            ...(data.platform?.selectedId &&
            !platforms.includes(data.platform.selectedId)
              ? [`[Platform] ${data.platform.selectedId}`]
              : []),
          ]}
          defaultGroups={[]}
          customCategoryName="작업 관리 플랫폼"
          placeholder="플랫폼을 선택해주세요..."
          searchPlaceholder="플랫폼을 입력하세요..."
        />
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

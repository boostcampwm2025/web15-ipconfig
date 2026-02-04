import { Checkbox } from '@/common/components/shadcn/checkbox';
import { Label } from '@/common/components/shadcn/label';
import { useState } from 'react';
import CounterInput from './CounterInput';
import type { CollaborationData } from '../types/CollaborationData';

interface CodeReviewPolicyProps {
  data: CollaborationData['reviewPolicy'];
  onUpdate: <K extends keyof CollaborationData['reviewPolicy']>(
    key: K,
    value: CollaborationData['reviewPolicy'][K],
  ) => void;
}

export default function CodeReviewPolicy({
  data,
  onUpdate,
}: CodeReviewPolicyProps) {
  const [editApproves, setEditApproves] = useState(false);
  const [editHours, setEditHours] = useState(false);

  return (
    <div className="max-w-[400px] rounded-2xl border border-gray-700 p-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-100">
        코드 리뷰 규칙
      </h2>

      <div className="mt-4 flex items-center">
        <p className="mb-2 flex-1 text-sm text-gray-300">최대 리뷰 시간</p>
        <CounterInput
          value={data.maxReviewHours}
          setValue={(value) => onUpdate('maxReviewHours', value as number)}
          editValue={editHours}
          setEditValue={setEditHours}
          isTime={true}
          max={100}
        />
      </div>

      <div className="mt-6 flex items-center">
        <p className="mb-2 flex-1 text-sm text-gray-300">필요한 Approve 수</p>
        <CounterInput
          value={data.approves}
          setValue={(value) => onUpdate('approves', value as number)}
          editValue={editApproves}
          setEditValue={setEditApproves}
          max={100}
        />
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Label htmlFor="merge-block" className="flex-1">
          요청된 변경 해결 전 병합 금지
        </Label>
        <Checkbox
          id="merge-block"
          className="h-5 w-5 cursor-pointer"
          checked={data.blockMerge}
          onCheckedChange={(checked: boolean | 'indeterminate') =>
            onUpdate('blockMerge', checked === true)
          }
        />
      </div>
    </div>
  );
}

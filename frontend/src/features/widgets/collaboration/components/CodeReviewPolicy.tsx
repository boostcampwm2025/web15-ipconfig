import { Checkbox } from '@/common/components/shadcn/checkbox';
import { Label } from '@/common/components/shadcn/label';
import { useState } from 'react';
import CounterInput from './CounterInput';

export default function CodeReviewPolicy() {
  const [approves, setApproves] = useState(2);
  const [maxReviewHours, setMaxReviewHours] = useState(24);

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
          value={maxReviewHours}
          setValue={setMaxReviewHours}
          editValue={editHours}
          setEditValue={setEditHours}
          isTime={true}
        />
      </div>

      <div className="mt-6 flex items-center">
        <p className="mb-2 flex-1 text-sm text-gray-300">필요한 Approve 수</p>
        <CounterInput
          value={approves}
          setValue={setApproves}
          editValue={editApproves}
          setEditValue={setEditApproves}
        />
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Label htmlFor="merge-block" className="flex-1">
          요청된 변경 해결 전 병합 금지
        </Label>
        <Checkbox defaultChecked id="merge-block" className="h-5 w-5" />
      </div>
    </div>
  );
}

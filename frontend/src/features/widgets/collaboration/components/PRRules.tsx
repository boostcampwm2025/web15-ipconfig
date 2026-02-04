import { useState } from 'react';

import {
  labelCandidates,
  strategies,
  versionTypes,
} from '../constants/options';
import type { CollaborationData } from '../types/CollaborationData';
import { Button } from '@/common/components/shadcn/button';

interface PRRulesProps {
  data: CollaborationData['prRules'];
  onUpdate: (
    key: keyof CollaborationData['prRules'],
    value: string | string[],
  ) => void;
}

export default function PRRules({ data, onUpdate }: PRRulesProps) {
  const [hoverVersion, setHoverVersion] = useState<string | null>(null);
  const [hoverStrategy, setHoverStrategy] = useState<string | null>(null);

  const toggleLabel = (label: string) => {
    // data.labelRules가 없거나 selectedIds가 없으면 빈 배열 처리
    const prev = data.labelRules?.selectedIds || [];
    const newValue = prev.includes(label)
      ? prev.filter((l) => l !== label)
      : [...prev, label];
    onUpdate('labelRules', newValue);
  };

  return (
    <div className="border-border text-foreground max-w-[400px] space-y-6 rounded-2xl border p-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold">PR 규칙</h2>

      <div>
        <p className="text-foreground mb-2 text-sm">버전 관리 방식</p>

        <div className="grid grid-cols-4 gap-2">
          {versionTypes.map((v) => (
            <div className="relative" key={v.key}>
              <Button
                variant={'ghost'}
                onMouseEnter={() => setHoverVersion(v.key)}
                onMouseLeave={() => setHoverVersion(null)}
                onClick={() => onUpdate('activeVersion', v.key)}
                className={`flex h-20 w-20 flex-col gap-1 border text-sm font-medium transition ${
                  data.activeVersion?.selectedId === v.key
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {v.icon}
                {v.title}
              </Button>

              {/* Tooltip 부분 */}
              {hoverVersion === v.key && (
                <div className="border-border bg-popover text-popover-foreground absolute bottom-full left-1/2 z-10 mb-1 w-max max-w-[160px] -translate-x-1/2 rounded border px-3 py-2 text-[10px] shadow-lg">
                  {v.desc}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-foreground mb-2 text-sm">PR 라벨 선택</p>
        <div className="flex flex-wrap gap-2">
          {labelCandidates.map((label) => (
            <Button
              variant={'ghost'}
              key={label}
              onClick={() => toggleLabel(label)}
              className={`text-s border px-3 py-1 ${
                (data?.labelRules?.selectedIds || []).includes(label)
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-border text-muted-foreground'
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-foreground mb-2 text-sm">병합 전략</p>

        <div className="grid grid-cols-3 gap-2">
          {strategies.map((s) => (
            <div key={s.key} className="relative">
              <Button
                variant={'ghost'}
                onMouseEnter={() => setHoverStrategy(s.key)}
                onMouseLeave={() => setHoverStrategy(null)}
                onClick={() => onUpdate('activeStrategy', s.key)}
                className={`flex h-24 w-24 flex-col gap-1 border text-xs font-medium transition ${
                  data.activeStrategy?.selectedId === s.key
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {s.icon}
                {s.title}
              </Button>

              {/* Tooltip 부분*/}
              {hoverStrategy === s.key && (
                <div className="border-border bg-popover text-popover-foreground absolute bottom-full left-1/2 z-10 mb-1 w-max max-w-[160px] -translate-x-1/2 rounded border px-3 py-2 text-[12px] shadow-lg">
                  {s.desc}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

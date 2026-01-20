import { useState } from 'react';

import type { CollaborationData } from './CollaborationWidget';
import {
  labelCandidates,
  strategies,
  versionTypes,
} from '../constants/options';

interface PRRulesProps {
  data: CollaborationData['prRules'];
  onUpdate: <K extends keyof CollaborationData['prRules']>(
    key: K,
    value: CollaborationData['prRules'][K],
  ) => void;
}

export default function PRRules({ data, onUpdate }: PRRulesProps) {
  const [hoverVersion, setHoverVersion] = useState<string | null>(null);
  const [hoverStrategy, setHoverStrategy] = useState<string | null>(null);

  const toggleLabel = (label: string) => {
    const prev = data.selectedLabels;
    const newValue = prev.includes(label)
      ? prev.filter((l) => l !== label)
      : [...prev, label];
    onUpdate('selectedLabels', newValue);
  };

  return (
    <div className="max-w-[400px] space-y-6 rounded-2xl border border-gray-700 p-6 text-gray-200">
      <h2 className="flex items-center gap-2 text-xl font-semibold">PR 규칙</h2>

      <div>
        <p className="mb-2 text-sm text-gray-300">버전 관리 방식</p>

        <div className="grid grid-cols-4 gap-2">
          {versionTypes.map((v) => (
            <div className="relative" key={v.key}>
              <button
                onMouseEnter={() => setHoverVersion(v.key)}
                onMouseLeave={() => setHoverVersion(null)}
                onClick={() => onUpdate('activeVersion', v.key)}
                className={`flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-md border text-sm font-medium transition ${
                  data.activeVersion === v.key
                    ? 'border-primary text-primary bg-green-900/40'
                    : 'border-gray-700 text-gray-300'
                }`}
              >
                {v.icon}
                {v.title}
              </button>

              {/* Tooltip 부분 */}
              {hoverVersion === v.key && (
                <div className="absolute bottom-full left-1/2 z-10 mb-1 w-max max-w-[160px] -translate-x-1/2 rounded border border-gray-600 bg-black/80 px-3 py-2 text-[10px] text-gray-200 shadow-lg">
                  {v.desc}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-300">PR 라벨 선택</p>
        <div className="flex flex-wrap gap-2">
          {labelCandidates.map((label) => (
            <button
              key={label}
              onClick={() => toggleLabel(label)}
              className={`text-s rounded-md border px-3 py-1 ${
                data.selectedLabels.includes(label)
                  ? 'border-primary text-primary bg-green-900/40'
                  : 'border-gray-700 text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm text-gray-300">병합 전략</p>

        <div className="grid grid-cols-3 gap-2">
          {strategies.map((s) => (
            <div key={s.key} className="relative">
              <button
                onMouseEnter={() => setHoverStrategy(s.key)}
                onMouseLeave={() => setHoverStrategy(null)}
                onClick={() => onUpdate('activeStrategy', s.key)}
                className={`flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border text-xs font-medium transition ${
                  data.activeStrategy === s.key
                    ? 'border-primary text-primary bg-green-900/30'
                    : 'border-gray-700 text-gray-300'
                }`}
              >
                {s.icon}
                {s.title}
              </button>

              {/* Tooltip 부분*/}
              {hoverStrategy === s.key && (
                <div className="absolute bottom-full left-1/2 z-10 mb-1 w-max max-w-[160px] -translate-x-1/2 rounded border border-gray-600 bg-black/80 px-3 py-2 text-[12px] text-gray-200 shadow-lg">
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

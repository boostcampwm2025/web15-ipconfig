import { useState } from 'react';
import {
  LuLayers,
  LuCalendarDays,
  LuListChecks,
  LuWrench,
  LuMerge,
  LuGitBranch,
  LuGitMerge,
} from 'react-icons/lu';

export default function PRRules() {
  const [activeVersion, setActiveVersion] = useState('semantic');
  const [hoverVersion, setHoverVersion] = useState<string | null>(null);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([
    'feature',
    'fix',
    'refactor',
  ]);
  const [activeStrategy, setActiveStrategy] = useState('squash');
  const [hoverStrategy, setHoverStrategy] = useState<string | null>(null);

  const versionTypes = [
    {
      key: 'semantic',
      title: '시맨틱',
      desc: 'MAJOR.MINOR.PATCH 기반 버전 증가',
      icon: <LuLayers size={20} />,
    },
    {
      key: 'calendar',
      title: '캘린더',
      desc: 'YYYY.MM 또는 YYYY.MM.DD 날짜 기반',
      icon: <LuCalendarDays size={20} />,
    },
    {
      key: 'conventional',
      title: '컨벤셔널',
      desc: '커밋 메시지 규칙 기반 자동 릴리즈',
      icon: <LuListChecks size={20} />,
    },
    {
      key: 'custom',
      title: '커스텀',
      desc: '팀에서 정의한 맞춤 버저닝',
      icon: <LuWrench size={20} />,
    },
  ];

  // PR 라벨
  const labelCandidates = [
    'feature',
    'fix',
    'refactor',
    'docs',
    'chore',
    'performance',
    'test',
    'ci',
    'build',
    'style',
    'hotfix',
  ];

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  // 병합 전략
  const strategies = [
    {
      key: 'squash',
      title: 'Squash',
      desc: '여러 커밋을 하나로 압축하여 병합',
      icon: <LuMerge size={20} />,
    },
    {
      key: 'rebase',
      title: 'Rebase',
      desc: '선형 히스토리 유지',
      icon: <LuGitBranch size={20} />,
    },
    {
      key: 'merge',
      title: 'Merge',
      desc: '병합 커밋 생성 방식',
      icon: <LuGitMerge size={20} />,
    },
  ];

  return (
    <div className="max-w-[400px] space-y-6 rounded-2xl border border-gray-700 p-6 text-gray-200">
      <h2 className="flex items-center gap-2 text-xl font-semibold">PR 규칙</h2>

      {/* Versioning */}
      <div>
        <p className="mb-2 text-sm text-gray-300">버전 관리 방식</p>

        <div className="grid grid-cols-4 gap-2">
          {versionTypes.map((v) => (
            <div className="relative" key={v.key}>
              <button
                onMouseEnter={() => setHoverVersion(v.key)}
                onMouseLeave={() => setHoverVersion(null)}
                onClick={() => setActiveVersion(v.key)}
                className={`flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-md border text-sm font-medium transition ${
                  activeVersion === v.key
                    ? 'border-green-500 bg-green-900/30 text-green-300'
                    : 'border-gray-700 text-gray-300'
                }`}
              >
                {v.icon}
                {v.title}
              </button>

              {/* Tooltip */}
              {hoverVersion === v.key && (
                <div className="absolute bottom-full left-1/2 z-10 mb-1 w-max max-w-[160px] -translate-x-1/2 rounded border border-gray-600 bg-black/80 px-3 py-2 text-[10px] break-words text-gray-200 shadow-lg">
                  {v.desc}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PR Labels */}
      <div>
        <p className="mb-2 text-sm text-gray-300">PR 라벨 선택</p>
        <div className="flex flex-wrap gap-2">
          {labelCandidates.map((label) => (
            <button
              key={label}
              onClick={() => toggleLabel(label)}
              className={`text-s rounded-md border px-3 py-1 ${
                selectedLabels.includes(label)
                  ? 'border-green-500 bg-green-700/40 text-green-300'
                  : 'border-gray-700 text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Merge Strategy */}
      <div>
        <p className="mb-2 text-sm text-gray-300">병합 전략</p>

        <div className="grid grid-cols-3 gap-2">
          {strategies.map((s) => (
            <div key={s.key} className="relative">
              <button
                onMouseEnter={() => setHoverStrategy(s.key)}
                onMouseLeave={() => setHoverStrategy(null)}
                onClick={() => setActiveStrategy(s.key)}
                className={`flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border text-xs font-medium transition ${
                  activeStrategy === s.key
                    ? 'border-green-500 bg-green-900/30 text-green-300'
                    : 'border-gray-700 text-gray-300'
                }`}
              >
                {s.icon}
                {s.title}
              </button>

              {/* Tooltip */}
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

import { Button } from '@/common/components/shadcn/button';
import type { User } from '@/common/types/user';
import { LuChevronRight, LuChevronLeft } from 'react-icons/lu';
import { LuExpand } from 'react-icons/lu';
import { LuArrowDownLeft } from 'react-icons/lu';

interface CompactPanelProps {
  members: User[];
  currentAgenda?: string;
  currentTime?: string;
  isExpanded: boolean;
  onToggle: () => void;
}

function getUserLabel(u: User) {
  return u?.name ?? u?.name ?? 'U';
}

function getAvatarStyleAndClass(u: User) {
  const c = u?.color;
  if (typeof c === 'string' && c.startsWith('bg-'))
    return { className: c, style: undefined };
  if (typeof c === 'string' && (c.startsWith('#') || c.startsWith('rgb'))) {
    return {
      className: '',
      style: { backgroundColor: c } as React.CSSProperties,
    };
  }
  return { className: 'bg-gray-600', style: undefined };
}

export default function CompactPanel({
  members,
  currentAgenda,
  currentTime,
  isExpanded,
  onToggle,
}: CompactPanelProps) {
  return (
    <aside className="relative inline-flex h-16 items-center rounded-xl border border-gray-700 bg-gray-800/90 pr-14 pl-4 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="flex shrink-0 -space-x-2">
          {members.slice(0, 6).map((member) => {
            const { className, style } = getAvatarStyleAndClass(member);
            const label = getUserLabel(member);
            return (
              <div
                key={member.id}
                className={[
                  'h-8 w-8 rounded-full border-2 border-[#1E1E1E]',
                  'grid place-items-center text-[10px] font-bold text-white',
                  className,
                ].join(' ')}
                style={style}
                title={label}
              >
                {label.slice(0, 2)}
              </div>
            );
          })}
          {members.length > 6 && (
            <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#1E1E1E] bg-gray-700 text-[10px] font-bold text-gray-200">
              +{members.length - 6}
            </div>
          )}
        </div>

        <div className="h-8 w-px shrink-0 bg-white/10" />

        <div className="relative flex min-w-0 flex-col justify-center">
          <div className="text-primary flex w-full items-center justify-center gap-2 text-[9px] font-medium">
            <span className="relative flex h-1.5 w-1.5">
              <span className="bg-primary/70 absolute inline-flex h-full w-full animate-ping rounded-full" />
              <span className="bg-primary relative inline-flex h-1.5 w-1.5 rounded-full" />
            </span>
            <span className="tracking-wide">CURRENT STAGE</span>
          </div>

          <div className="flex min-w-0 items-center justify-center gap-2">
            <div className="text-sm font-bold whitespace-nowrap text-white">
              {currentAgenda || '휴식 시간'}
            </div>
            <div className="font-mono text-sm font-normal whitespace-nowrap text-gray-400">
              {currentTime || '00:00'}
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        onClick={onToggle}
        className="absolute right-3 z-10 cursor-pointer"
      >
        <LuChevronLeft size={20} className="text-gray-300" />
      </Button>
    </aside>
  );
}

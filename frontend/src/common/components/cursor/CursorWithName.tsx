import { LuMousePointer2 } from 'react-icons/lu';
import { getBrightenedColor, getContrastClass } from '@/utils/color';
import { cn } from '@/common/lib/utils';
import type { CursorProps } from './type';

function CursorWithName({ nickname, color, type, message }: CursorProps) {
  return (
    <div className="pointer-events-none -translate-x-1 -translate-y-1 select-none">
      <LuMousePointer2
        className="size-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
        style={{
          color: getBrightenedColor(color),
          fill: color,
        }}
      />
      {type === 'chat' ? (
        <div
          className={cn(
            'flex w-auto translate-x-5 -translate-y-1.5 flex-col items-start justify-center rounded-lg rounded-tl-none px-2.5 py-1 font-semibold whitespace-nowrap',
            getContrastClass(color),
          )}
          style={{ backgroundColor: color }}
        >
          <div className="text-[10px] opacity-80">{nickname}</div>
          <div className="text-[13px] font-bold">{message}</div>
        </div>
      ) : (
        <span
          className={cn(
            'flex translate-x-5 -translate-y-1.5 items-center justify-center px-2 py-0.5',
            'w-auto rounded-md text-center text-[12px] font-semibold whitespace-nowrap',
            getContrastClass(color),
          )}
          style={{ backgroundColor: color }}
        >
          {nickname}
        </span>
      )}
    </div>
  );
}

export default CursorWithName;

import { LuMousePointer2 } from 'react-icons/lu';
import { getBrightenedColor, getContrastClass } from '@/utils/color';
import { cn } from '@/common/lib/utils';

interface CursorWithNameProps {
  nickname: string;
  color: string;
  x: number;
  y: number;
}

function CursorWithName({ nickname, color, x, y }: CursorWithNameProps) {
  return (
    <div className="pointer-events-none -translate-x-1 -translate-y-1 select-none">
      <LuMousePointer2
        className="size-6 drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
        style={{
          color: getBrightenedColor(color),
          fill: color,
          x: x,
          y: y,
        }}
      />
      <div
        className="flex translate-x-5 -translate-y-1.5 items-center justify-center rounded-md px-2 py-0.5"
        style={{ backgroundColor: color }}
      >
        <span
          className={cn(
            'w-auto text-center text-[12px] font-semibold whitespace-nowrap',
            getContrastClass(color),
          )}
        >
          {nickname}
        </span>
      </div>
    </div>
  );
}

export default CursorWithName;

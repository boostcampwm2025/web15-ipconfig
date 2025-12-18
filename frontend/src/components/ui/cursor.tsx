import { LuMousePointer2 } from 'react-icons/lu';

interface CursorProps {
  nickname: string;
  color: string;
  backgroundColor: string;
  x: number;
  y: number;
}

function Cursor({ nickname, color, backgroundColor, x, y }: CursorProps) {
  const renderColor = color ? color : '#000000';

  return (
    <div className="pointer-events-none -translate-x-1 -translate-y-1 select-none">
      <div className="flex flex-col items-start">
        <LuMousePointer2
          className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
          style={{
            color: renderColor,
            background: backgroundColor,
            x: x,
            y: y,
          }}
        />
        {nickname}
      </div>
    </div>
  );
}

export default Cursor;

import { Avatar, AvatarFallback } from '@/common/components/shadcn/avatar';
import { Button } from '@/common/components/shadcn/button';
import { cn } from '@/common/lib/utils';
import { getContrastClass } from '@/utils/color';
import { useCanvas } from '@/common/components/canvas/context/CanvasProvider';
import { getCameraByCursorPosition } from '@/common/components/canvas/lib/positionTransform';
import { useUserInfoById, useUserCursorById } from '@/common/store/user';

function UserItem({ userId }: { userId: string }) {
  const { setCamera, getFrameInfo, setClickedFollow } = useCanvas();
  const user = useUserInfoById(userId);
  const position = useUserCursorById(userId);

  if (!user) return null;
  if (!position) return null;

  return (
    <Button
      variant="ghost"
      className="group flex items-center justify-start gap-2.5 px-2 py-5"
      onClick={() => {
        setClickedFollow(true);
        setCamera((prev) => {
          return getCameraByCursorPosition({
            frameInfo: getFrameInfo(),
            cursorPosition: { x: position.x ?? 0, y: position.y ?? 0 },
            camera: prev,
          });
        });
        // transition duration(300ms) 후에 clickedFollow를 false로 변경
        setTimeout(() => {
          setClickedFollow(false);
        }, 300);
      }}
    >
      <Avatar className="size-7 !ring-gray-800">
        <AvatarFallback
          className={cn(getContrastClass(user.color), 'text-xs font-semibold')}
          style={{ backgroundColor: user.color }}
        >
          {user.nickname[0]}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start justify-center text-[13px]">
        <div>{user.nickname}</div>
        {/* TODO: 팔로우 기능으로 구현 */}
        <div className="text-muted-foreground hidden text-[11px] group-hover:block">
          클릭하여 이동
        </div>
      </div>
    </Button>
  );
}

export default UserItem;

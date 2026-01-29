import { Avatar, AvatarFallback } from '@/common/components/shadcn/avatar';
import { Button } from '@/common/components/shadcn/button';
import { Separator } from '@/common/components/shadcn/separator';
import { cn } from '@/common/lib/utils';
import type { User } from '@/common/types/user';
import { getContrastClass } from '@/utils/color';

interface MyUserItemProps {
  user: User;
}

function MyUserItem({ user }: MyUserItemProps) {
  return (
    <>
      <div className="group hover:bg-accent/50 flex items-center justify-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors duration-100 select-none">
        {/* 유저 아바타 */}
        <Avatar className="size-7 !ring-gray-800">
          <AvatarFallback
            className={cn(
              getContrastClass(user.color),
              'text-xs font-semibold',
            )}
            style={{ backgroundColor: user.color }}
          >
            {user.nickname[0]}
          </AvatarFallback>
        </Avatar>
        {/* 유저 닉네임 */}
        <div className="flex items-center gap-2 text-[13px]">
          <div>{user.nickname}</div>
          <div className="text-gray-400">(나)</div>
        </div>
      </div>
      {/* TODO: 스포트라이트 기능 추가 */}
      {/* <Button variant="secondary" size="sm" className="w-full">
        <span className="text-xs">스포트라이트</span>
      </Button> */}
      <Separator />
    </>
  );
}

export default MyUserItem;

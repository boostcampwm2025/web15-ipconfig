import { Avatar, AvatarFallback } from '@/common/components/shadcn/avatar';
import { Button } from '@/common/components/shadcn/button';
import { cn } from '@/common/lib/utils';
import { getContrastClass } from '@/utils/color';
import type { User } from '@/common/types/user';

interface UserItemProps {
  user: User;
}

function UserItem({ user }: UserItemProps) {
  return (
    <Button
      variant="ghost"
      className="group flex items-center justify-start gap-2.5 px-2 py-5"
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
        <div className="hidden text-[11px] text-gray-400 group-hover:block">
          클릭하여 팔로우
        </div>
      </div>
    </Button>
  );
}

export default UserItem;

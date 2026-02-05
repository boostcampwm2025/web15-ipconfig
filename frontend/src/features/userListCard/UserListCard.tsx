import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/common/components/shadcn/avatar';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/common/components/shadcn/popover';
import { getContrastClass } from '@/utils/color';
import { useUserIds, useMyId } from '@/common/store/user';
import { cn } from '@/common/lib/utils';
import MyUserItem from './MyUserItem';
import UserItem from './UserItem';
import { useUserInfoById } from '@/common/store/user';

const VISIBLE_USER_COUNT = 3;

export default function UserListCard() {
  const userIds = useUserIds();
  const myId = useMyId();
  const totalUserCount = userIds.length;
  const hiddenUserCount = totalUserCount - VISIBLE_USER_COUNT;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <AvatarGroup className="hover:bg-secondary cursor-pointer -space-x-1 rounded-xl p-2 transition-colors">
          {userIds.slice(0, VISIBLE_USER_COUNT).map((id) => (
            <UserAvatarItem key={id} userId={id} />
          ))}
          {hiddenUserCount > 0 && (
            <AvatarGroupCount className="bg-secondary !ring-background text-xs">
              +{hiddenUserCount}
            </AvatarGroupCount>
          )}
        </AvatarGroup>
      </PopoverTrigger>
      <PopoverContent className="bg-popover border-border w-fit border p-2">
        <div className="flex flex-col gap-2 text-sm">
          {userIds.map((id) => {
            const isMe = id === myId;
            return isMe ? (
              <MyUserItem key={id} userId={id} />
            ) : (
              <UserItem key={id} userId={id} />
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// 개별 아바타를 위한 작은 컴포넌트 추가 (자기 정보만 구독)
function UserAvatarItem({ userId }: { userId: string }) {
  const user = useUserInfoById(userId);
  if (!user) return null;

  return (
    <Avatar size="sm" className="!ring-gray-800">
      <AvatarFallback
        className={cn(getContrastClass(user.color), 'text-xs font-semibold')}
        style={{ backgroundColor: user.color }}
      >
        {user.nickname[0]}
      </AvatarFallback>
    </Avatar>
  );
}

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
import { useUserList } from '@/common/store/user';
import { cn } from '@/common/lib/utils';
import { useMe } from '@/common/store/user';
import MyUserItem from './MyUserItem';
import UserItem from './UserItem';

const VISIBLE_USER_COUNT = 3;

function UserListInfo() {
  const userList = useUserList();
  const totalUserCount = userList.length;
  const hiddenUserCount = totalUserCount - VISIBLE_USER_COUNT;
  const myInfo = useMe();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <AvatarGroup className="hover:bg-secondary cursor-pointer -space-x-1 rounded-xl p-2 transition-colors">
          {userList.slice(0, VISIBLE_USER_COUNT).map((user) => (
            <Avatar key={user.id} size="sm" className="!ring-background">
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
          {userList.map((user) => {
            const isMe = user.id === myInfo?.id;
            if (isMe) {
              return <MyUserItem key={user.id} user={user} />;
            }
            return <UserItem key={user.id} user={user} />;
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default UserListInfo;

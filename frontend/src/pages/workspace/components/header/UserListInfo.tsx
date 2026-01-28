import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/common/components/shadcn/avatar';
import { Button } from '@/common/components/shadcn/button';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/common/components/shadcn/popover';
import { getContrastClass } from '@/utils/color';

const userList = [
  {
    id: '1',
    nickname: 'John Doe',
    color: '#f59e0b',
  },
  {
    id: '2',
    nickname: 'Jane Doe',
    color: '#84cc16',
  },
  {
    id: '3',
    nickname: 'Jim Doe',
    color: '#10b981',
  },
  {
    id: '4',
    nickname: 'Jill Doe',
    color: '#0ea5e9',
  },
  {
    id: '5',
    nickname: 'Jack Doe',
    color: '#f43f5e',
  },
];

function UserListInfo() {
  const totalUserCount = userList.length;
  const visibleUserCount = 3;
  const hiddenUserCount = totalUserCount - visibleUserCount;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <AvatarGroup className="hover:bg-secondary cursor-pointer -space-x-1 rounded-xl p-2 transition-colors">
          {userList.slice(0, visibleUserCount).map((user) => (
            <Avatar key={user.id} size="sm" className="!ring-gray-800">
              <AvatarFallback
                className={getContrastClass(user.color)}
                style={{ backgroundColor: user.color }}
              >
                {user.nickname[0]}
              </AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount className="bg-secondary text-xs !ring-gray-800">
            +{hiddenUserCount}
          </AvatarGroupCount>
        </AvatarGroup>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="flex flex-col gap-2">
          {userList.map((user) => (
            <div key={user.id}>{user.nickname}</div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default UserListInfo;

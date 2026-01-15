import { LuShare2 } from 'react-icons/lu';
import type { User } from '@/common/types/user';
import { INITIAL_USERS } from '@/common/mocks/users';

interface TeamMemberListProps {
  onUserHover: (e: React.MouseEvent, user: User) => void;
  onUserLeave: () => void;
}

function TeamMemberList({ onUserHover, onUserLeave }: TeamMemberListProps) {
  return (
    <div className="mt-auto border-t border-gray-700 pt-6">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-xs font-bold text-gray-400 uppercase">
          Team Members ({INITIAL_USERS.length})
        </h4>
      </div>

      <ul className="space-y-2">
        <button className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-lg bg-gray-700 py-1">
          <LuShare2 />
          <div className="flex h-8 items-center text-sm font-semibold">
            초대하기
          </div>
        </button>
        <div className="overflow-y-auto">
          {INITIAL_USERS.map((user) => (
            <li
              key={user.id}
              className="group relative flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-700"
              onMouseEnter={(e) => onUserHover(e, user)}
              onMouseLeave={onUserLeave}
            >
              <div
                className={`h-8 w-8 rounded-full ${user.color} flex items-center justify-center text-xs font-bold text-gray-900`}
              >
                {user.name[0]}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-200">
                  {user.name}
                </div>
                <div
                  className={`text-xs ${
                    user.status === '준비중' ? 'text-gray-500' : user.textColor
                  }`}
                >
                  {user.status}
                </div>
              </div>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
}

export default TeamMemberList;

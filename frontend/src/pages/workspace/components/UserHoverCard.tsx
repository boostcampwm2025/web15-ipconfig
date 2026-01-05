import { LuClock, LuZap } from 'react-icons/lu';
import type { User } from '@/common/types/user';

interface UserHoverCardProps {
  user: User;
  position: { top: number; left: number };
}

function UserHoverCard({ user, position }: UserHoverCardProps) {
  return (
    <div
      className="animate-slide-in pointer-events-none fixed z-100 w-64 rounded-xl border border-gray-600 bg-gray-800 p-4 shadow-2xl"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="mb-3 flex items-start gap-4">
        <div
          className={`h-12 w-12 rounded-full ${user.color} flex items-center justify-center text-lg font-bold text-gray-900`}
        >
          {user.name[0]}
        </div>
        <div>
          <h4 className="text-lg font-bold text-white">{user.name}</h4>
          <span className="rounded-full border border-gray-600 bg-gray-700 px-2 py-0.5 text-xs text-blue-400">
            {user.role}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <LuClock className="text-gray-500" size={14} />
          <span>{user.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <LuZap className="text-yellow-400" size={14} />
          <span>{user.style}</span>
        </div>
      </div>
      <div className="mt-3 border-t border-gray-700 pt-3">
        <div className="mb-1 text-[10px] tracking-wide text-gray-500 uppercase">
          Activity
        </div>
        <div className="flex h-8 items-end gap-1">
          {user.activity.map((height, i) => (
            <div
              key={i}
              className={`flex-1 rounded-sm ${
                i % 2 === 0 ? 'bg-gray-600' : 'bg-teal-500'
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserHoverCard;

import type { User } from '@/common/types/user';
import TeamMemberList from './TeamMemberList';
import AgendaTimeline from './AgendaTimeline';

interface InfoPanelProps {
  onUserHover: (e: React.MouseEvent, user: User) => void;
  onUserLeave: () => void;
}

function InfoPanel({ onUserHover, onUserLeave }: InfoPanelProps) {
  return (
    <aside className="relative z-40 flex w-72 shrink-0 flex-col border-l border-gray-700 bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-700 p-4">
        <h3 className="text-sm font-bold text-gray-300">AGENDA</h3>
        <span className="rounded bg-gray-700 px-2 py-0.5 text-xs text-gray-400">
          00:12:45
        </span>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <AgendaTimeline />
        <TeamMemberList onUserHover={onUserHover} onUserLeave={onUserLeave} />
      </div>
    </aside>
  );
}

export default InfoPanel;

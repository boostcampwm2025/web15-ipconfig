import type { UserExtended } from '@/common/types/user';
import TeamMemberList from './TeamMemberList';
import AgendaTimeline from './AgendaTimeline';
import { LuX } from 'react-icons/lu';
import { Button } from '@/common/components/shadcn/button';
import { InviteButton } from './InviteButton';

interface InfoPanelProps {
  onUserHover: (e: React.MouseEvent, user: UserExtended) => void;
  onUserLeave: () => void;
  onToggle: () => void;
}

function InfoPanel({ onUserHover, onUserLeave, onToggle }: InfoPanelProps) {
  return (
    <aside className="relative z-40 mt-18 flex h-full w-72 shrink-0 flex-col rounded-xl border border-gray-700 bg-gray-800">
      <div className="flex items-center justify-end pt-2 pr-3">
        <Button variant="ghost" onClick={onToggle} className="cursor-pointer">
          <LuX size={20} className="text-gray-300" />
        </Button>
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        <InviteButton />
        <AgendaTimeline />
        <TeamMemberList onUserHover={onUserHover} onUserLeave={onUserLeave} />
      </div>
    </aside>
  );
}

export default InfoPanel;

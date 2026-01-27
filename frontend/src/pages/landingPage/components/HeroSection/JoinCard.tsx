import { Input } from '@/common/components/shadcn/input';
import { MainButton } from '..';
import { Users } from 'lucide-react';
import { useJoinWorkspace } from '@/common/hooks/useJoinWorkspace';

const JoinCard = () => {
  const { joinCode, joinError, handleJoinCodeChange, handleJoinWorkspace } =
    useJoinWorkspace();
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur transition-all hover:border-slate-700 hover:bg-slate-900">
      <div className="mb-6 text-left">
        <h2 className="mb-2 text-2xl font-bold text-blue-400">참여하기</h2>
        <p className="text-sm text-slate-400">
          동료에게 공유받은{' '}
          <span className="font-semibold text-slate-100">초대 코드</span>를
          입력해서
          <br />
          이미 만들어진 워크스페이스에 입장하세요.
        </p>
      </div>
      <div className="mt-auto flex flex-col gap-4">
        <Input
          type="text"
          placeholder="코드 입력 (예: 1a2b3c)"
          value={joinCode}
          onChange={handleJoinCodeChange}
          maxLength={32}
          className="h-12 text-center font-mono text-base focus-visible:border-blue-500 focus-visible:ring-blue-500/50"
        />
        {joinError && (
          <p className="text-left font-mono text-sm text-red-400">
            {joinError}
          </p>
        )}
        <MainButton
          text="워크스페이스 참가"
          icon={<Users size={18} />}
          onClick={handleJoinWorkspace}
          className="bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:bg-blue-600"
        />
      </div>
    </div>
  );
};

export default JoinCard;

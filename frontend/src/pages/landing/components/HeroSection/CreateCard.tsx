import { Input } from '@/common/components/shadcn/input';
import MainButton from '@/pages/landing/components/MainButton';
import { Plus } from 'lucide-react';
import { useCreateWorkspace } from '@/common/hooks/useCreateWorkspace';

function CreateCard() {
  const {
    createCode,
    createError,
    handleCreateCodeChange,
    handleCreateWorkspace,
  } = useCreateWorkspace();
  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur transition-all hover:border-slate-700 hover:bg-slate-900">
      <div className="mb-6 text-left">
        <h2 className="mb-2 text-2xl font-bold text-green-400">
          새로 시작하기
        </h2>
        <p className="text-sm text-slate-400">
          새로운 워크스페이스를 만들고&nbsp;
          <span className="font-semibold text-slate-100">원하는 코드</span>
          를 입력하거나
          <br />
          미입력 시&nbsp;
          <span className="font-semibold text-slate-100">무작위 코드</span>를
          발급받으세요.
        </p>
      </div>
      <div className="mt-auto flex flex-col gap-4">
        <Input
          type="text"
          placeholder="코드 입력 (선택사항, 미입력 시 무작위 생성)"
          value={createCode}
          onChange={handleCreateCodeChange}
          maxLength={32}
          className="h-12 text-center"
        />
        {createError && (
          <p className="text-left text-sm text-red-400">{createError}</p>
        )}
        <MainButton
          text="새 워크스페이스 생성"
          icon={<Plus size={18} />}
          onClick={handleCreateWorkspace}
          className="bg-green-500 text-slate-950 shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:bg-green-600"
        />
      </div>
    </div>
  );
}

export default CreateCard;

import { Input } from '@/common/components/shadcn/input';
import { MainButton } from '..';
import { Plus } from 'lucide-react';
import { useCreateWorkspace } from '@/common/hooks/useCreateWorkspace';

const CreateCard = () => {
  const { register, handleSubmit, errors, onSubmit } = useCreateWorkspace();

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
          <br />
          코드는&nbsp;
          <span className="font-semibold text-slate-100">
            32자 이하의 영소문자와 숫자
          </span>
          만 입력 가능합니다.
        </p>
      </div>
      <div className="mt-auto flex flex-col gap-4">
        <Input
          type="text"
          placeholder="코드 입력 (선택사항, 미입력 시 무작위 생성)"
          {...register('code')}
          maxLength={32}
          className="h-12 text-center font-mono text-base"
        />
        {errors.code && (
          <p className="text-left font-mono text-sm text-red-400">
            {errors.code.message}
          </p>
        )}
        <MainButton
          text="새 워크스페이스 생성"
          icon={<Plus size={18} />}
          onClick={handleSubmit(onSubmit)}
          className="bg-green-500 text-slate-950 shadow-[0_0_20px_rgba(74,222,128,0.3)] hover:bg-green-600"
        />
      </div>
    </div>
  );
};

export default CreateCard;

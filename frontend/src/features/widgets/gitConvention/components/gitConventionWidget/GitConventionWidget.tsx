import { useGitConvention } from '@/features/widgets/gitConvention/hooks/useGitConvention';
import { StrategySelector } from './StrategySelector';
import { BranchRules } from './BranchRules';
import { CommitStyle } from './CommitStyle';
import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { LuGitBranch } from 'react-icons/lu';
import { Button } from '@/common/components/shadcn/button';

function GitConventionWidget() {
  const { strategy, branchRules, commitConvention, isModalOpen, actions } =
    useGitConvention();

  return (
    <WidgetFrame
      title="Git 컨벤션"
      icon={<LuGitBranch className="text-green-500" />}
    >
      <section className="relative flex h-full w-[400px] flex-col gap-4 p-1">
        <StrategySelector
          value={strategy}
          onChange={actions.requestChangeStrategy}
        />
        <div className="bg-border my-1 h-px" />
        <BranchRules
          strategy={strategy.selectedId}
          rules={branchRules}
          onChange={actions.updateBranchRules}
        />
        <div className="bg-border my-1 h-px" />
        <CommitStyle
          convention={commitConvention}
          onChange={actions.updateCommitConvention}
        />
        {/* TODO: 임시 모달 UI (나중에 WarningModal로 대체) */}
        {isModalOpen && (
          <div className="bg-background/80 absolute inset-0 z-50 flex items-center justify-center p-4 text-center backdrop-blur-sm">
            <div className="bg-popover text-popover-foreground space-y-3 rounded-lg border p-4 shadow-md">
              <p className="text-sm font-semibold">전략을 변경하시겠습니까?</p>
              <p className="text-muted-foreground text-xs">
                모든 규칙이 초기화됩니다.
              </p>
              <div className="flex justify-center gap-2">
                <Button
                  variant={'outline'}
                  onClick={actions.cancelChangeStrategy}
                  className="hover:bg-muted rounded border text-xs"
                >
                  취소
                </Button>
                <Button
                  onClick={actions.confirmChangeStrategy}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded text-xs"
                >
                  변경
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </WidgetFrame>
  );
}

export default GitConventionWidget;

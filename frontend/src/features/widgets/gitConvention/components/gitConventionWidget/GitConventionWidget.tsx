import type { GitConventionData } from '@/features/widgets/gitConvention/types/gitConvention';
import { useGitConvention } from '@/features/widgets/gitConvention/hooks/useGitConvention';
import { StrategySelector } from './StrategySelector';
import { BranchRules } from './BranchRules';
import { CommitStyle } from './CommitStyle';
import { useWidgetIdAndType } from '@/common/components/widgetFrame/context/WidgetContext';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import { emitUpdateWidget } from '@/common/api/socket';
import WidgetFrame from '@/common/components/widgetFrame/WidgetFrame';
import { LuGitBranch } from 'react-icons/lu';

function GitConventionWidget() {
  const { widgetId } = useWidgetIdAndType();
  const content = useWorkspaceWidgetStore(
    useShallow(
      (state) =>
        state.widgetList.find((widget) => widget.widgetId === widgetId)
          ?.content,
    ),
  );
  // GitConventionContentDto 임을 명시하고, 이후에 data 사용
  const gitConventionContent = content as GitConventionData;

  const { strategy, branchRules, commitConvention, isModalOpen, actions } =
    useGitConvention({
      data: gitConventionContent,
      onDataChange: (nextData) => {
        emitUpdateWidget(widgetId, nextData);
      },
    });

  return (
    <WidgetFrame
      title="Git 컨벤션"
      icon={<LuGitBranch className="text-green-500" />}
    >
      <section className="relative flex h-full w-full flex-col gap-4 p-1">
        <StrategySelector
          value={strategy}
          onChange={actions.requestChangeStrategy}
        />
        <div className="bg-border my-1 h-px" />
        <BranchRules rules={branchRules} onChange={actions.updateBranchRules} />
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
                <button
                  onClick={actions.cancelChangeStrategy}
                  className="hover:bg-muted rounded border px-3 py-1 text-xs"
                >
                  취소
                </button>
                <button
                  onClick={actions.confirmChangeStrategy}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-3 py-1 text-xs"
                >
                  변경
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </WidgetFrame>
  );
}

export default GitConventionWidget;

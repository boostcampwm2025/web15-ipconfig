import type { WidgetData } from '@/common/types/widgetData';
import WidgetContainer from '@/common/components/widget/WidgetContainer';
import WidgetHeader from '@/common/components/widget/WidgetHeader';
import { LuGitBranch } from 'react-icons/lu';
import { useGitConvention } from '@/features/widgets/gitConvention/hooks/useGitConvention';
import type { GitConventionData } from '@/features/widgets/gitConvention/types/gitConvention';
import { GIT_CONVENTION_PRESETS } from '@/features/widgets/gitConvention/constants/presets';
import { useState } from 'react';
import { StrategySelector } from './StrategySelector';
import { BranchRules } from './BranchRules';
import { CommitStyle } from './CommitStyle';

function GitConventionWidget({ x, y, width, height }: WidgetData) {
  // TODO: 추후 Socket 연동 시 제거 및 대체
  const [localData, setLocalData] = useState<GitConventionData>(
    GIT_CONVENTION_PRESETS.GITHUB_FLOW,
  );

  const { strategy, branchRules, isModalOpen, actions } = useGitConvention({
    data: localData,
    onDataChange: setLocalData,
  });

  return (
    <WidgetContainer
      id="git-convention-widget"
      x={100}
      y={100}
      width={300}
      height={200}
      zIndex={1}
    >
      <WidgetHeader
        title="Git Convention"
        icon={<LuGitBranch className="text-primary" size={18} />}
        onClickDelete={() => {}}
      />
      <section className="relative flex h-full flex-col gap-4 p-1">
        <StrategySelector
          value={strategy}
          onChange={actions.requestChangeStrategy}
        />
        <div className="bg-border my-1 h-px" />
        <BranchRules rules={branchRules} onChange={actions.updateBranchRules} />
        <div className="bg-border my-1 h-px" />
        <CommitStyle
          convention={localData.commitConvention}
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
    </WidgetContainer>
  );
}

export default GitConventionWidget;

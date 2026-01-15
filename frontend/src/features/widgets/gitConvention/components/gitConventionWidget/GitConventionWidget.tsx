import type {
  WidgetData,
  WidgetContent,
  GitConventionContentDto,
  MoveWidgetData,
} from '@/common/types/widgetData';
import WidgetContainer from '@/common/components/widget/WidgetContainer';
import WidgetHeader from '@/common/components/widget/WidgetHeader';
import { LuGitBranch } from 'react-icons/lu';
import { useGitConvention } from '@/features/widgets/gitConvention/hooks/useGitConvention';
import { StrategySelector } from './StrategySelector';
import { BranchRules } from './BranchRules';
import { CommitStyle } from './CommitStyle';

interface GitConventionWidgetProps {
  widgetId: string;
  data: WidgetData;
  emitUpdateWidget: (widgetId: string, data: WidgetContent) => void;
  emitDeleteWidget: (widgetId: string) => void;
  emitMoveWidget: (widgetId: string, data: MoveWidgetData) => void;
}

function GitConventionWidget({
  widgetId,
  data,
  emitDeleteWidget,
  emitUpdateWidget,
  emitMoveWidget,
}: GitConventionWidgetProps) {
  // GitConventionContentDto 임을 명시하고, 이후에 data 사용
  const gitConventionContent = data.content as GitConventionContentDto;

  const { strategy, branchRules, commitConvention, isModalOpen, actions } =
    useGitConvention({
      data: gitConventionContent.data,
      onDataChange: (nextData) => {
        emitUpdateWidget(widgetId, {
          widgetType: 'GIT_CONVENTION',
          data: nextData,
        });
      },
    });

  return (
    <WidgetContainer
      id={widgetId}
      x={data.x}
      y={data.y}
      width={data.width}
      height={data.height}
      zIndex={data.zIndex}
      content={data.content}
    >
      <WidgetHeader
        title="Git Convention"
        icon={<LuGitBranch className="text-primary" size={18} />}
        onClickDelete={() => emitDeleteWidget(widgetId)}
        onDrag={() =>
          emitMoveWidget(widgetId, {
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            zIndex: data.zIndex,
          })
        }
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
    </WidgetContainer>
  );
}

export default GitConventionWidget;

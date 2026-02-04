import { useClipboard } from '@/common/hooks/useClipboard';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/common/components/shadcn/dialog';
import { Button } from '@/common/components/shadcn/button';
import { LuSettings, LuArrowLeft } from 'react-icons/lu';
import { useState } from 'react';
import { useWorkspaceWidgetStore } from '@/common/store/workspace';
import { useShallow } from 'zustand/react/shallow';
import { EXPORT_CONFIGS } from '../constant/ExportConfigs';
import { getWidgetContents } from '../utils/getWidgetContents';
import { mappingIcon } from '../utils/mappingIcon';
import { CopyButton } from './CopyButton';

export function ExportSettingFilesDialog() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { widgetList } = useWorkspaceWidgetStore(
    useShallow((state) => ({
      widgetList: state.widgetList,
    })),
  );

  const selectedConfig = EXPORT_CONFIGS.find((c) => c.id === selectedId);
  const content = selectedConfig
    ? getWidgetContents(widgetList, selectedConfig.type)
    : '';

  return (
    <DialogContent className="z-999 sm:max-w-2xl">
      <DialogHeader>
        <div className="flex items-center gap-2">
          {selectedConfig && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedId(null)}
              className="text-muted-foreground hover:text-foreground h-8 w-8"
              title="목록으로 돌아가기"
            >
              <LuArrowLeft size={18} />
              <span className="sr-only">뒤로가기</span>
            </Button>
          )}
          <DialogTitle className="flex items-center gap-2">
            <LuSettings size={18} className="text-primary" />
            {selectedConfig ? selectedConfig.label : '설정 파일 내보내기'}
          </DialogTitle>
        </div>
        <DialogDescription>
          {selectedConfig
            ? `아래 내용을 ${selectedConfig.fileName} 파일에 복사하여 사용하세요.`
            : '프로젝트 세팅에 필요한 설정 파일을 선택하여 내보낼 수 있습니다.'}
        </DialogDescription>
      </DialogHeader>

      <div className="border-border bg-muted flex h-[45vh] flex-col overflow-y-auto rounded-lg border px-4 py-3">
        {selectedConfig ? (
          <div className="text-foreground h-full w-full overflow-auto font-mono text-sm whitespace-pre">
            {content}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {EXPORT_CONFIGS.map((config) => (
              <Button
                key={config.id}
                variant="ghost"
                className="hover:bg-background/80 flex h-auto w-full items-center justify-start gap-4 p-4 hover:shadow-sm"
                onClick={() => setSelectedId(config.id)}
              >
                <div className="bg-background border-border flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm">
                  {mappingIcon(config.type)}
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-foreground text-base font-semibold">
                    {config.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {config.description}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>

      <DialogFooter>
        {selectedConfig && <CopyButton content={content} />}
      </DialogFooter>
    </DialogContent>
  );
}

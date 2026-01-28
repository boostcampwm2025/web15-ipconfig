import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/shadcn/dropdown-menu';
import { Button } from '@/common/components/shadcn/button';
import {
  LuCircleX,
  LuUpload as LuExport,
  LuFileText,
  LuCheck,
  LuCopy,
  LuSettings,
} from 'react-icons/lu';
import { DropdownMenuContent } from '@/common/components/shadcn/dropdown-menu';
import { DropdownMenuGroup } from '@/common/components/shadcn/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/common/components/shadcn/dialog';
import { useMarkdown } from '@/common/hooks/useMarkdown';
import { useClipboard } from '@/common/hooks/useClipboard';
import { useWorkspaceInfoStore } from '@/common/store/workspace';
import { SpinnerCustom } from '@/common/components/SpinnerCustom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import 'github-markdown-css/github-markdown.css';

function ExportDocDialog({
  markdown,
  isLoading,
  error,
}: {
  markdown: string;
  isLoading: boolean;
  error: string | null;
}) {
  const { isCopied, handleCopyToClipboard } = useClipboard();

  return (
    <DialogContent className="z-999 sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <LuFileText size={18} className="text-primary-600" />
          마크다운으로 내보내기
        </DialogTitle>
        <DialogDescription>
          협의한 그라운드 룰 및 컨벤션을 마크다운으로 내보낼 수 있습니다.
          <br />
          GitHub 위키나 README에 바로 붙여넣으세요.
        </DialogDescription>
      </DialogHeader>
      <div className="flex h-[45vh] items-center justify-center overflow-y-auto rounded-lg bg-[#0C1117] px-4 py-3">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <SpinnerCustom />
            <span>불러오는 중...</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2">
            <LuCircleX size={16} className="text-red-500" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="markdown-body h-full w-full">
            <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => handleCopyToClipboard(markdown)}
        >
          {isCopied ? (
            <LuCheck size={16} className="text-green-500" />
          ) : (
            <LuCopy size={16} />
          )}
          {isCopied ? '복사 완료!' : '복사 하기'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function ExportSettingFilesDialog() {
  return (
    <DialogContent className="z-999 sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <LuSettings size={18} className="text-primary-600" />
          설정 파일 내보내기
        </DialogTitle>
        <DialogDescription>
          프로젝트 세팅에 필요한 설정 파일을 내보낼 수 있습니다.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}

function ExportGroupDropdownButton() {
  const [dialogMenu, setDialogMenu] = useState<string>('none');
  const { markdown, isLoading, error, fetchMarkdown } = useMarkdown();
  const { workspaceId } = useWorkspaceInfoStore();

  const handleDialogMenu = () => {
    switch (dialogMenu) {
      case 'doc':
        return (
          <ExportDocDialog
            markdown={markdown}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'settingFiles':
        return <ExportSettingFilesDialog />;
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <LuExport />
            결과 내보내기
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <DialogTrigger
                className="flex w-full items-center gap-2"
                onClick={() => {
                  fetchMarkdown(workspaceId);
                  setDialogMenu('doc');
                }}
              >
                <LuFileText size={16} />
                문서 내보내기
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DialogTrigger
                className="flex w-full items-center gap-2"
                onClick={() => {
                  setDialogMenu('settingFiles');
                }}
              >
                <LuSettings size={16} />
                설정 파일 내보내기
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {handleDialogMenu()}
    </Dialog>
  );
}

export default ExportGroupDropdownButton;

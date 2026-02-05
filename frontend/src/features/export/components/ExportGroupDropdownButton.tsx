import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/common/components/shadcn/dropdown-menu';
import { Button } from '@/common/components/shadcn/button';
import { LuUpload as LuExport, LuFileText, LuSettings } from 'react-icons/lu';
import { DropdownMenuContent } from '@/common/components/shadcn/dropdown-menu';
import { DropdownMenuGroup } from '@/common/components/shadcn/dropdown-menu';
import { Dialog, DialogTrigger } from '@/common/components/shadcn/dialog';
import { useMarkdown } from '@/common/hooks/useMarkdown';
import { useWorkspaceInfoStore } from '@/common/store/workspace';
import { useState } from 'react';
import 'github-markdown-css/github-markdown.css';
import { ExportDocDialog } from './ExportDocDialog';
import { ExportSettingFilesDialog } from './ExportSettingFilesDialog';

export function ExportGroupDropdownButton() {
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
          <Button variant="secondary" size="sm">
            <LuExport />
            결과 내보내기
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-40"
          align="start"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <DialogTrigger
                className="flex w-full cursor-pointer items-center gap-2"
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
                className="flex w-full cursor-pointer items-center gap-2"
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

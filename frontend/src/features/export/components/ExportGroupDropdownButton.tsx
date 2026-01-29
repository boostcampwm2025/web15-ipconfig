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
  LuFileJson,
  LuContainer,
  LuArrowLeft,
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
import {
  useWorkspaceInfoStore,
  useWorkspaceWidgetStore,
} from '@/common/store/workspace';
import { SpinnerCustom } from '@/common/components/SpinnerCustom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';
import 'github-markdown-css/github-markdown.css';
import { useShallow } from 'zustand/react/shallow';
import { INITIAL_FORMAT_DATA } from '@/features/widgets/format/constants/initial';
import type { WidgetList } from '@/common/types/widgetData';

interface ExportConfig {
  id: string;
  label: string;
  description: string;
  fileName: string;
  icon: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getContent: (widgetList: any[]) => string;
}

function getPrettierContent(widgetList: WidgetList) {
  const widget = widgetList.find((w) => w.type === 'CODE_FORMAT');
  const content = widget?.content || INITIAL_FORMAT_DATA;
  return JSON.stringify(content, null, 2);
}

// function getDockerContent(widgetList: WidgetList) {
//   // TODO: 추후 Docker 위젯 연동 시 실제 데이터로 교체
//   return `# Docker configuration\n\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nRUN npm run build\nCMD ["npm", "run", "start"]`;
// }

const EXPORT_CONFIGS: ExportConfig[] = [
  {
    id: 'prettier',
    label: 'Prettier 설정',
    description: '.prettierrc 파일로 내보냅니다.',
    fileName: '.prettierrc',
    icon: <LuFileJson className="h-5 w-5 text-pink-500" />,
    getContent: getPrettierContent,
  },
  // {
  //   id: 'docker',
  //   label: 'Docker 설정',
  //   description: 'Dockerfile을 생성합니다. (준비 중)',
  //   fileName: 'Dockerfile',
  //   icon: <LuContainer className="h-5 w-5 text-blue-500" />,
  //   getContent: getDockerContent,
  // },
  // 추후 다른 설정 파일 위젯이 추가되면 여기에 설정을 추가하면 됨
];

// ----------------------------------------------------------------------

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
          variant="secondary"
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
  const { isCopied, handleCopyToClipboard } = useClipboard();
  // 선택된 설정 파일 ID (null이면 리스트 뷰)
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { widgetList } = useWorkspaceWidgetStore(
    useShallow((state) => ({
      widgetList: state.widgetList,
    })),
  );

  // 선택된 설정 정보 및 콘텐츠 생성
  const selectedConfig = EXPORT_CONFIGS.find((c) => c.id === selectedId);
  const content = selectedConfig ? selectedConfig.getContent(widgetList) : '';

  const handleBack = () => {
    setSelectedId(null);
  };

  return (
    <DialogContent className="z-999 sm:max-w-2xl">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <LuSettings size={18} className="text-primary-600" />
            {selectedConfig ? selectedConfig.label : '설정 파일 내보내기'}
          </DialogTitle>
          {/* 상세 뷰일 때 헤더 오른쪽에 뒤로가기 버튼 표시 */}
          {selectedConfig && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8"
              title="목록으로 돌아가기"
            >
              <LuArrowLeft size={18} />
              <span className="sr-only">뒤로가기</span>
            </Button>
          )}
        </div>
        <DialogDescription>
          {selectedConfig
            ? `아래 내용을 ${selectedConfig.fileName} 파일에 복사하여 사용하세요.`
            : '프로젝트 세팅에 필요한 설정 파일을 선택하여 내보낼 수 있습니다.'}
        </DialogDescription>
      </DialogHeader>

      <div className="flex h-[45vh] flex-col overflow-y-auto rounded-lg bg-[#0C1117] px-4 py-3">
        {selectedConfig ? (
          // [Detail View] 설정 파일 내용 표시
          <div className="h-full w-full overflow-auto font-mono text-sm whitespace-pre text-gray-300">
            {content}
          </div>
        ) : (
          // [List View] 내보내기 가능한 항목 리스트 표시
          <div className="flex flex-col gap-2">
            {EXPORT_CONFIGS.map((config) => (
              <Button
                key={config.id}
                variant="ghost"
                className="flex h-auto w-full items-center justify-start gap-4 p-4 hover:bg-white/10"
                onClick={() => setSelectedId(config.id)}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800">
                  {config.icon}
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-base font-semibold text-white">
                    {config.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {config.description}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>

      <DialogFooter>
        {selectedConfig && (
          <Button
            variant="secondary"
            onClick={() => handleCopyToClipboard(content)}
          >
            {isCopied ? (
              <LuCheck size={16} className="text-green-500" />
            ) : (
              <LuCopy size={16} />
            )}
            {isCopied ? '복사 완료!' : '복사 하기'}
          </Button>
        )}
      </DialogFooter>
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

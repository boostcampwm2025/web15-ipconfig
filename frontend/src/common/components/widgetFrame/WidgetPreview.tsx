import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  vs,
  vscDarkPlus,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  customStyle,
  codeTagProps,
} from '@/features/widgets/format/constants/syntaxHighlighter';
import { useTheme } from '@/common/contexts/ThemeProvider';
import { cn } from '@/common/lib/utils';

interface WidgetPreviewProps {
  code: string;
  fileName?: string;
  language?: string;
}

export function WidgetPreview({
  code,
  fileName = 'component.tsx',
  language = 'tsx',
}: WidgetPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="absolute top-1/2 right-[calc(100%+80px)] w-[800px] -translate-y-1/2">
      <div
        className={cn(
          'border-border w-full overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm transition-colors',
          isDark ? 'bg-slate-900/50' : 'bg-white/30',
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between border-b px-3 py-2 transition-colors',
            isDark
              ? 'border-slate-700/50 bg-slate-800/30'
              : 'border-border bg-slate-100/50',
          )}
        >
          <span
            className={cn(
              'text-xs font-medium',
              isDark ? 'text-slate-400' : 'text-muted-foreground',
            )}
          >
            미리보기
          </span>
          <span
            className={cn(
              'font-mono text-[10px]',
              isDark ? 'text-slate-500' : 'text-muted-foreground',
            )}
          >
            {fileName}
          </span>
        </div>
        <div className="max-h-[600px] overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={isDark ? vscDarkPlus : vs}
            customStyle={{
              ...customStyle,
              background: 'transparent',
            }}
            codeTagProps={{
              style: {
                ...codeTagProps,
                backgroundColor: 'transparent',
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
      {/* 미리보기 연결선 */}
      <div className="absolute top-1/2 -right-15 translate-y-1/2">
        <div className="border-border w-[60px] border"></div>
      </div>
    </div>
  );
}

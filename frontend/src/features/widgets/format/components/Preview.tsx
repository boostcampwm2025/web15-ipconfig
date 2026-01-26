import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { customStyle, codeTagProps } from '../constants/syntaxHighlighter';

interface PreviewProps {
  formattedCode: string;
}

function Preview({ formattedCode }: PreviewProps) {
  return (
    <div className="absolute top-1/2 right-[calc(100%+80px)] w-[800px] -translate-y-1/2">
      <div className="border-border w-full overflow-hidden rounded-xl border bg-slate-900/50 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/30 px-3 py-2">
          <span className="text-xs font-medium text-slate-400">미리보기</span>
          <span className="font-mono text-[10px] text-slate-500">
            component.tsx
          </span>
        </div>
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language="tsx"
            style={vscDarkPlus}
            customStyle={customStyle}
            codeTagProps={{
              style: codeTagProps,
            }}
          >
            {formattedCode}
          </SyntaxHighlighter>
        </div>
      </div>
      {/* 미리보기 연결선 */}
      <div className="absolute top-1/2 -right-15 translate-y-1/2">
        <div className="w-[60px] border border-gray-600"></div>
      </div>
    </div>
  );
}

export default Preview;

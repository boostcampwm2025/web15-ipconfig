import { Button } from '@/common/components/shadcn/button';
import { cn } from '@/common/lib/utils';
import { LuFileText, LuX, LuCopy, LuCheck } from 'react-icons/lu';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
}

function ExportModal({ isOpen, onClose, markdown }: ExportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="animate-scale-in border-border bg-card flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl border shadow-2xl">
        <div className="border-border bg-muted/50 flex items-center justify-between rounded-t-xl border-b p-5">
          <div className="flex items-center gap-3">
            <div className="bg-background rounded-lg p-2 shadow-sm">
              <LuFileText className="text-foreground" size={24} />
            </div>
            <div>
              <h3 className="text-foreground text-lg font-bold">
                Export to README.md
              </h3>
              <p className="text-muted-foreground text-xs">
                GitHub 위키나 README에 바로 붙여넣으세요.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <LuX size={24} />
          </Button>
        </div>

        <div className="group bg-muted/30 relative flex-1 overflow-auto p-0">
          <div className="absolute top-4 right-4 z-10 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigator.clipboard.writeText(markdown)}
              className="h-7 text-xs shadow-lg"
            >
              <LuCopy size={12} className="mr-1" /> Copy Raw
            </Button>
          </div>
          <pre className="text-foreground selection:bg-primary/30 p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {markdown}
          </pre>
        </div>

        <div className="border-border bg-card flex justify-end gap-3 rounded-b-xl border-t p-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(markdown);
              alert('Copied to clipboard!');
            }}
            className="shadow-primary/20 shadow-lg"
          >
            <LuCheck size={16} className="mr-2" />
            Copy to Clipboard
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;

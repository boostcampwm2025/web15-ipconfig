import { Button } from '@/common/components/shadcn/button';
import { useClipboard } from '@/common/hooks/useClipboard';
import { LuCopy, LuShare2 } from 'react-icons/lu';
import { Dialog } from '@/common/components/shadcn/dialog';
import { DropdownMenu } from '@/common/components/shadcn/dropdown-menu';
import { DropdownMenuTrigger } from '@/common/components/shadcn/dropdown-menu';
import { DropdownMenuContent } from '@/common/components/shadcn/dropdown-menu';
import { DropdownMenuGroup } from '@/common/components/shadcn/dropdown-menu';
import { DropdownMenuItem } from '@/common/components/shadcn/dropdown-menu';
import { DialogTrigger } from '@/common/components/shadcn/dialog';
import { toast } from 'sonner';
import { useWorkspaceInfoStore } from '@/common/store/workspace';

function InviteButton() {
  const { isCopied, handleCopyToClipboard } = useClipboard();

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="sm">
            공유하기
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
                  try {
                    handleCopyToClipboard(window.location.href);
                    toast.success('주소가 복사되었습니다.');
                  } catch (err) {
                    toast.error('주소 복사에 실패했어요.', {
                      description: (err as Error).message,
                    });
                  }
                }}
              >
                <LuShare2 size={16} />
                주소 복사하기
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DialogTrigger
                className="flex w-full cursor-pointer items-center gap-2"
                onClick={() => {
                  try {
                    const { workspaceId } = useWorkspaceInfoStore.getState();
                    handleCopyToClipboard(workspaceId);
                    toast.success('코드가 복사되었습니다.');
                  } catch (err) {
                    toast.error('코드 복사에 실패했어요.', {
                      description: (err as Error).message,
                    });
                  }
                }}
              >
                <LuCopy size={16} />
                코드 복사하기
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}

export default InviteButton;

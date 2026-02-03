import { LuCheck, LuCopy, LuGithub } from 'react-icons/lu';
import { type ComponentProps } from 'react';
import { cn } from '@/common/lib/utils';
import { Button } from '@/common/components/shadcn/button';

import { ExportGroupDropdownButton } from '@/features/export/components/ExportGroupDropdownButton';
import { UserListCard } from '@/features/userListCard';
import InviteButton from './InviteButton';
import { WorkspaceTitleInput } from './WorkspaceTitleInput';

function RoundedContainer({ children, className }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'pointer-events-auto flex h-full items-center rounded-xl border border-gray-700 bg-gray-800 px-2 py-1 shadow-2xl backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  );
}

function WorkspaceHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex shrink-0 items-center justify-between bg-transparent px-3.5 py-4">
      <RoundedContainer>
        <img
          src="/teamconfig-logo.png"
          alt="logo"
          className="mr-2 h-9 w-9 shrink-0"
        />
        <div>
          <WorkspaceTitleInput />
        </div>
      </RoundedContainer>

      <RoundedContainer className="gap-2">
        <UserListCard />
        <ExportGroupDropdownButton />
        <Button size="sm" variant="secondary">
          <LuGithub size={16} />
          초기 세팅하기
        </Button>
        <InviteButton />
      </RoundedContainer>
    </header>
  );
}

export default WorkspaceHeader;

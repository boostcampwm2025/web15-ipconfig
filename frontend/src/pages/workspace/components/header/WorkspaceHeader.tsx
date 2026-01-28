import { LuGithub, LuSettings } from 'react-icons/lu';
import { type ComponentProps } from 'react';
import { cn } from '@/common/lib/utils';
import { Button } from '@/common/components/shadcn/button';

import ExportGroupDropdownButton from '@/features/export/components/ExportGroupDropdownButton';
import UserListInfo from './UserListInfo';

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

function TitleInput() {
  return (
    <input
      type="text"
      defaultValue="제목을 입력하세요"
      className="focus:border-primary-600/50 focus:ring-primary-600/50 w-full rounded-md border border-transparent bg-transparent px-1 text-base font-bold text-white outline-none focus:ring"
    />
  );
}

function WorkspaceHeader() {
  return (
    <header className="pointer-events-none flex shrink-0 items-center justify-between bg-transparent px-4 py-2">
      <RoundedContainer>
        <img
          src="/teamconfig-logo.png"
          alt="logo"
          className="mr-2 h-9 w-9 shrink-0"
        />
        <div>
          <TitleInput />
        </div>
      </RoundedContainer>

      <RoundedContainer className="gap-2">
        <UserListInfo />
        <ExportGroupDropdownButton />
        <Button size="sm" variant="secondary">
          <LuGithub size={16} />
          초기 세팅하기
        </Button>
      </RoundedContainer>
    </header>
  );
}

export default WorkspaceHeader;

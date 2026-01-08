import { Button } from '@/common/components/shadcn/button';
import { Input } from '@/common/components/shadcn/input';
import { LuSearch } from 'react-icons/lu';

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
}

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="relative mb-6 flex items-center justify-between select-none">
      <Input
        type="text"
        placeholder="기술 스택을 검색하세요"
        className="focus:border-main text-gray-300 focus:outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button
        variant="ghost"
        className="hover:text-main absolute right-1 text-gray-500 hover:cursor-pointer dark:hover:bg-transparent"
      >
        <LuSearch size={16} />
      </Button>
    </div>
  );
}

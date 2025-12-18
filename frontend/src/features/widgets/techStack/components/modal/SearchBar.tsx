import { LuSearch } from 'react-icons/lu';

export default function SearchBar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (search: string) => void;
}) {
  return (
    <div className="relative mb-4 flex items-center justify-between pb-2 select-none">
      <input
        type="text"
        placeholder="기술 스택을 검색하세요"
        className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm font-medium text-gray-300 placeholder-gray-400 focus:border-blue-400 focus:outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="absolute right-3 text-gray-500 hover:cursor-pointer hover:text-blue-400">
        <LuSearch size={16} />
      </button>
    </div>
  );
}

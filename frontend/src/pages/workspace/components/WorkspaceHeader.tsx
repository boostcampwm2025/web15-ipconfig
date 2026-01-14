import { LuFileText, LuGithub } from 'react-icons/lu';

interface WorkspaceHeaderProps {
  onExportClick: () => void;
}

function WorkspaceHeader({ onExportClick }: WorkspaceHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between bg-transparent px-6">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-blue-500 text-xl font-bold text-white shadow-lg shadow-purple-500/20">
          15
        </div>
        <div>
          <input
            type="text"
            defaultValue="web-15-demo"
            className="w-64 border-none bg-transparent p-0 text-lg font-bold text-white transition-colors outline-none hover:text-teal-400 focus:ring-0"
          />
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
            Saved just now
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={onExportClick}
          className="flex transform items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:bg-blue-500"
        >
          <LuFileText size={16} />
          문서 내보내기
        </button>

        <button
          onClick={onExportClick}
          className="flex transform items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105 hover:bg-blue-500"
        >
          <LuGithub size={16} />
          레포지토리 초기 세팅하기
        </button>
      </div>
    </header>
  );
}

export default WorkspaceHeader;

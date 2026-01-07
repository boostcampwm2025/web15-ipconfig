function AgendaTimeline() {
  return (
    <div className="relative space-y-8 border-l-2 border-gray-700 pl-4">
      <div className="relative">
        <div className="absolute -left-[21px] h-3 w-3 rounded-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.6)]"></div>
        <h4 className="mb-1 text-sm font-bold text-white">1. Ice Breaking</h4>
        <p className="text-xs text-gray-400">성향 파악 및 자기소개</p>
      </div>
      <div className="relative opacity-50">
        <div className="absolute -left-[21px] h-3 w-3 rounded-full border-2 border-gray-900 bg-gray-600"></div>
        <h4 className="mb-1 text-sm font-bold text-gray-300">
          2. Ground Rules
        </h4>
        <p className="text-xs text-gray-500">기술 스택 및 컨벤션 확정</p>
      </div>
      <div className="relative opacity-50">
        <div className="absolute -left-[21px] h-3 w-3 rounded-full border-2 border-gray-900 bg-gray-600"></div>
        <h4 className="mb-1 text-sm font-bold text-gray-300">3. Ideation</h4>
        <p className="text-xs text-gray-500">기능 정의 및 우선순위</p>
      </div>
    </div>
  );
}

export default AgendaTimeline;

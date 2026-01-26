// 쓸모 없고 별도 로직은 없는데 가독성은 낮아서 뺐습니다
const HeroHeader = () => {
  return (
    <>
      <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 font-mono text-xs text-green-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </span>
        v1.0.0 Stable Release
      </div>
      <h1 className="mb-6 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-5xl leading-tight font-bold text-transparent md:text-6xl">
        우리 팀의 <span className="font-mono text-green-400">0</span> 번째
        스프린트를 위한 <br className="hidden md:block" />
        <span className="font-mono text-green-400">team.config</span>{' '}
      </h1>
      <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-400">
        어색한 아이스브레이킹부터 그라운드 룰, README 자동 생성까지
        <br />
        개발자들의 언어로 소통하고, 프로젝트 세팅을 한번에 끝내세요
      </p>
    </>
  );
};

export default HeroHeader;

import { useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/common/components/shadcn/button';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative px-6 pt-32 pb-20">
      <div className="container mx-auto max-w-5xl text-center">
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

        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <Button
            onClick={() => navigate('/workspace')}
            className="group relative transform rounded-lg bg-green-500 px-8 py-4 font-mono font-bold text-slate-950 shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all hover:scale-105 hover:bg-green-400"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">&gt; build start:team</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import CreateButton from './CreateButton';
import { LightRays } from '@/common/components/shadcn/light-rays';
import { useTheme } from '@/common/contexts/ThemeProvider';

function CTASection() {
  const { theme } = useTheme();
  return (
    <section className="flex flex-col items-center justify-center px-10 pb-20">
      <div className="relative flex h-100 w-4/5 max-w-5xl flex-col items-center justify-center rounded-2xl border px-25 py-20">
        <h2 className="z-50 mb-10 text-center text-2xl leading-relaxed font-extrabold md:text-3xl">
          막막한 첫 팀 프로젝트 회의, <br />
          team.<span className="text-primary">config</span>에서 즐겁게
          시작하세요
        </h2>
        <CreateButton animation={false} className="z-50" />
        <LightRays color={theme === 'dark' ? '#003417' : '#d7ffe6'} count={2} />
      </div>
    </section>
  );
}

export default CTASection;

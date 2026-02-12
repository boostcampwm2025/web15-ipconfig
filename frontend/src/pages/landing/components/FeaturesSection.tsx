import { motion } from 'motion/react';

function FeatureBackgroundGradient() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full w-full overflow-hidden">
      <div className="absolute top-[5%] left-[-15%] h-120 w-120 rounded-full bg-green-500/10 blur-[100px]" />
      <div className="absolute top-[30%] left-[80%] h-120 w-120 rounded-full bg-green-500/10 blur-[100px]" />
      <div className="absolute top-[65%] left-[-15%] h-120 w-120 rounded-full bg-green-500/10 blur-[200px]" />
    </div>
  );
}

function FeaturesSection() {
  return (
    <section className="relative px-6 py-24">
      <FeatureBackgroundGradient />
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <div className="border-primary/20 bg-primary/5 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-0.5 text-sm font-medium">
          핵심 기능
        </div>
        <h2 className="text-foreground mb-4 text-3xl font-extrabold md:text-4xl">
          팀 프로젝트 시작을 위한{' '}
          <span className="text-primary">완벽한 솔루션</span>
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl">
          캔버스에서 자유롭게 위젯으로 내용을 합의하고, 회의 결과를 문서와
          설정파일로!
        </p>
      </motion.div>

      <div className="flex w-full flex-col gap-25">
        <div className="mx-auto flex max-w-4/5">
          <div className="w-1/2">
            <h3 className="mb-2 text-2xl font-extrabold">
              캔버스 기반 인터렉티브한 합의
            </h3>
            <p className="text-muted-foreground">
              캔버스 화면에서 같이 조작하며 실시간으로 합의할 수 있어요
            </p>
          </div>
          <div className="w-1/2 overflow-hidden rounded-xl">
            <video className="scale-101 object-cover" autoPlay muted loop>
              <source src="/videos/canvas-feature.webm" type="video/webm" />
              브라우저가 비디오를 지원하지 않습니다.
            </video>
          </div>
        </div>

        <div className="mx-auto flex max-w-4/5">
          <div className="w-1/2">
            <h3 className="mb-2 text-2xl font-extrabold">
              위젯으로 논의 주제 합의
            </h3>
            <p className="text-muted-foreground">
              기술 스택, 코딩 컨벤션 등 놓칠 수 있는 논의 주제를 <br />
              위젯을 함께 편집하며 쉽고 재밌게 합의할 수 있어요
            </p>
          </div>
          <div className="w-1/2 overflow-hidden rounded-xl">
            <video className="scale-101 object-cover" autoPlay muted loop>
              <source src="/videos/widget-feature.webm" type="video/webm" />
              브라우저가 비디오를 지원하지 않습니다.
            </video>
          </div>
        </div>

        <div className="mx-auto flex max-w-4/5">
          <div className="w-1/2">
            <h3 className="mb-2 text-2xl font-extrabold">
              커서 챗으로 부담없고 정확한 의견 제시
            </h3>
            <p className="text-muted-foreground">
              마이크를 켜는 부담 없이, 커서 챗으로 <br />
              정확한 곳을 가리키며 의견을 제시할 수 있어요
            </p>
          </div>
          <div className="w-1/2 overflow-hidden rounded-xl">
            <video
              className="-translate-y-20 scale-150 object-cover"
              autoPlay
              muted
              loop
            >
              <source src="/videos/cursor-chat.webm" type="video/webm" />
              브라우저가 비디오를 지원하지 않습니다.
            </video>
          </div>
        </div>

        <div className="mx-auto flex max-w-4/5">
          <div className="w-1/2">
            <h3 className="mb-2 text-2xl font-extrabold">
              자동 문서화 및 파일 생성
            </h3>
            <p className="text-muted-foreground">
              회의만 하면 자동으로 위키용 마크다운 문서가 생성되고, <br /> 초기
              세팅에 도움이 되는 파일을 자동 생성해요
            </p>
          </div>
          <div className="w-1/2 overflow-hidden rounded-xl">
            <video className="scale-101 object-cover" autoPlay muted loop>
              <source src="/videos/export-feature.webm" type="video/webm" />
              브라우저가 비디오를 지원하지 않습니다.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;

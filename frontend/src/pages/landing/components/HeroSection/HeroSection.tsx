import HeroHeader from './HeroHeader';
import JoinCard from './JoinCard';
import CreateCard from './CreateCard';

function HeroSection() {
  return (
    <section className="relative px-6 pt-32 pb-20">
      <div className="container mx-auto max-w-5xl text-center">
        <HeroHeader />
        <div className="mx-auto mt-10 grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          <JoinCard />
          <CreateCard />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

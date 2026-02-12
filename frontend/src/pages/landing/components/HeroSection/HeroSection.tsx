import HeroContent from './HeroContent';
import CreateButton from '../CreateButton';

function HeroSection() {
  return (
    <section className="relative px-6 pt-32 pb-10">
      <div className="container mx-auto max-w-5xl text-center">
        <HeroContent />
        <CreateButton />
      </div>
    </section>
  );
}

export default HeroSection;

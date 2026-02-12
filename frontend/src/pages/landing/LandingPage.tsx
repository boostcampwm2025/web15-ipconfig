import { useState, useEffect } from 'react';
import BackgroundGradient from './components/BackgroundGradient';
import { LandingHeader } from './components/LandingHeader';
import { HeroSection } from './components/HeroSection';
import Footer from './components/Footer';
import { Safari } from '@/common/components/shadcn/safari';
import CTASection from './components/CTASection';
import FeaturesSection from './components/FeaturesSection';

function LandingPage() {
  return (
    <>
      <div className="mx-auto min-h-screen w-full overflow-x-hidden dark:bg-gray-950">
        <BackgroundGradient />
        <LandingHeader />
        <HeroSection />

        <section className="z-30 mx-auto flex w-5/6 max-w-6xl">
          <Safari
            url="https://teamconfig.work"
            videoSrc="/videos/workspace.webm"
            mode="simple"
          />
        </section>

        <FeaturesSection />

        <CTASection />
        <div className="mx-auto flex w-5/6 max-w-6xl">
          <hr className="w-full" />
        </div>

        <Footer />
      </div>
    </>
  );
}

export default LandingPage;

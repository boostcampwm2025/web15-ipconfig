import { useState, useEffect } from 'react';
import {
  BackgroundGradient,
  Navbar,
  HeroSection,
  Footer,
} from './components/landing';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-slate-50 selection:bg-green-500/30 selection:text-green-200">
      <BackgroundGradient />
      <Navbar scrolled={scrolled} />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default LandingPage;

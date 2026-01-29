import { useState, useEffect } from 'react';
import BackgroundGradient from './components/BackgroundGradient';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import Footer from './components/Footer';

function LandingPage() {
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
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-50 selection:bg-green-500/30 selection:text-green-200">
      <BackgroundGradient />
      <Navbar scrolled={scrolled} />
      <HeroSection />
      <Footer />
    </div>
  );
}

export default LandingPage;

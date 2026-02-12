import { cn } from '@/common/lib/utils';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ThemeToggle } from '@/common/components/ThemeToggle';
import { Button } from '@/common/components/shadcn/button';
import { LuStar } from 'react-icons/lu';
import { IoLogoGithub } from 'react-icons/io';
import axios from 'axios';
import { Skeleton } from '@/common/components/shadcn/skeleton';

const SCROLL_OFFSET = 60;

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [starCount, setStarCount] = useState<number | null>(null);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > SCROLL_OFFSET);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchGithubInfo = async () => {
      const { data } = await axios.get(
        'https://api.github.com/repos/boostcampwm2025/web15-ipconfig',
      );
      setStarCount(data.stargazers_count);
    };
    fetchGithubInfo();
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-10 top-4 z-100 flex justify-between rounded-4xl border bg-gray-100 px-5 py-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.075)] transition-all duration-200 dark:bg-gray-800',
        scrolled &&
          'inset-x-0 top-0 rounded-none bg-gray-100/60 backdrop-blur-sm dark:bg-gray-800/40',
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-xl font-bold tracking-tighter"
        >
          <span>
            team<span className="text-primary">.config</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 px-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            window.open(
              'https://github.com/boostcampwm2025/web15-ipconfig',
              '_blank',
            )
          }
        >
          <IoLogoGithub />
          <span className="font-bold">GITHUB</span>
          <LuStar className="fill-yellow-400 text-yellow-400 transition-colors duration-300 dark:fill-yellow-300 dark:text-yellow-300" />
          {starCount ? (
            <span className="font-bold">{starCount}</span>
          ) : (
            <Skeleton className="h-full w-4" />
          )}
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}

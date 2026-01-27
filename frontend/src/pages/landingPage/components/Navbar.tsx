import { Layout } from 'lucide-react';
import { Button } from '@/common/components/shadcn/button';
import { Link } from 'react-router';

interface NavbarProps {
  scrolled: boolean;
}

// 버튼 색이 마음에 안 듬...
const Navbar = ({ scrolled }: NavbarProps) => {
  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-800 bg-slate-950/80 py-3 backdrop-blur-md'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-mono text-xl font-bold tracking-tighter"
        >
          <img
            src="/teamconfig-logo.png"
            alt="logo"
            className="h-8 w-8 object-cover"
          />
          <span className="text-white">
            team<span className="text-green-400">.config</span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
          <Button className="rounded-full border border-slate-700 bg-green-600 px-5 py-2 text-white transition-all hover:bg-green-500">
            Log in
          </Button>
          <Button className="rounded-full border border-slate-700 bg-slate-800 px-5 py-2 text-white transition-all hover:bg-slate-700">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

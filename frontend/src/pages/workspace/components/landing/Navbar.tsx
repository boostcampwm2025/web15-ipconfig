import { Terminal } from 'lucide-react';

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
        <div className="flex items-center gap-2 font-mono text-xl font-bold tracking-tighter">
          <Terminal className="text-green-400" size={24} />
          <span className="text-white">
            team<span className="text-green-400">.config</span>
          </span>
        </div>
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex"></div>
      </div>
    </nav>
  );
};

export default Navbar;

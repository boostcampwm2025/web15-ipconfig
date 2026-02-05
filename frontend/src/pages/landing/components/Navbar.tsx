import { Link } from 'react-router';

interface NavbarProps {
  scrolled: boolean;
}

export function Navbar({ scrolled }: NavbarProps) {
  return (
    <nav
      className={`fixed z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-border bg-background/80 border-b py-3 backdrop-blur-md'
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
            team<span className="text-primary">.config</span>
          </span>
        </Link>
      </div>
    </nav>
  );
}

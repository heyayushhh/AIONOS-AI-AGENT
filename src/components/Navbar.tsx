import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenWorkspace?: () => void;
}

export default function Navbar({ onOpenWorkspace }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const sectionId = href.substring(2);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (href === '/') {
      if (location.pathname !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  const handleWorkspace = () => {
    setMobileMenuOpen(false);
    if (onOpenWorkspace) {
      onOpenWorkspace();
    } else {
      navigate('/dashboard');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Solutions', href: '/#solutions' },
    { label: 'About', href: '/#about' },
  ];

  const isHomeActive = location.pathname === '/' && !location.hash;

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <nav
        className={`relative z-10 flex items-center justify-between px-6 sm:px-8 py-5 max-w-7xl mx-auto transition-all duration-300 ${
          scrolled ? 'glass-nav rounded-2xl mt-3 shadow-2xl' : ''
        }`}
        aria-label="Main Navigation"
      >
        {/* Logo */}
        <button
          onClick={() => handleNavClick('/')}
          className="font-display text-3xl tracking-tight text-white hover:opacity-90 transition-opacity flex items-center gap-1.5 focus:outline-none"
        >
          <span>DealFlow AI</span>
          <span className="text-xl font-normal text-white/90">✦</span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => {
            const isActive = link.href === '/' ? isHomeActive : location.hash === link.href.replace('/', '');
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className={`transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Right CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleWorkspace}
            className="liquid-glass rounded-full px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm text-foreground hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center gap-1.5 font-medium select-none"
          >
            <span>Open Workspace</span>
            <span className="text-white/80">→</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pt-2 pb-6 max-w-7xl mx-auto">
          <div className="glass-panel rounded-2xl p-5 flex flex-col gap-4 border border-white/10 shadow-2xl">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-left text-base text-muted-foreground hover:text-foreground py-2 border-b border-white/5 last:border-0 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={handleWorkspace}
              className="liquid-glass rounded-full w-full py-3 text-sm text-foreground text-center font-medium mt-2 cursor-pointer"
            >
              Open Workspace →
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

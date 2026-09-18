import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onOpenWorkspace?: () => void;
}

export default function Hero({ onOpenWorkspace }: HeroProps) {
  const navigate = useNavigate();

  const handleOpenWorkspace = () => {
    if (onOpenWorkspace) {
      onOpenWorkspace();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <section className="relative z-10 flex flex-col items-center text-center px-6 pt-32 pb-40 min-h-[calc(100vh-100px)] justify-center">
      {/* Main Heading */}
      <h1 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal animate-fade-rise text-white">
        Turn business{' '}
        <em className="not-italic text-muted-foreground">opportunities</em> into{' '}
        <em className="not-italic text-muted-foreground">lasting partnerships.</em>
      </h1>

      {/* Hero Subtext */}
      <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
        From the first business inquiry to the next strategic partnership, DealFlow AI helps teams
        qualify opportunities, discover capabilities, and create meaningful proposals with the power
        of intelligent workflows.
      </p>

      {/* Hero CTA Button */}
      <button
        type="button"
        onClick={handleOpenWorkspace}
        className="liquid-glass rounded-full px-12 sm:px-14 py-4 sm:py-5 text-sm sm:text-base text-foreground mt-12 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer animate-fade-rise-delay-2 flex items-center gap-2 group focus:outline-none"
      >
        <span className="font-medium tracking-wide">Open DealFlow Workspace</span>
        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
      </button>
    </section>
  );
}

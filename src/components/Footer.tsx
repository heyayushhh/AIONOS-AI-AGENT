export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/5 py-12 px-6 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="font-display text-xl text-white tracking-tight">DealFlow AI ✦</span>
        <span className="text-white/30">|</span>
        <span>Sales & Alliances Intelligence Platform</span>
      </div>

      <div className="flex items-center gap-6">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
        <a href="#solutions" className="hover:text-foreground transition-colors">Solutions</a>
        <a href="#about" className="hover:text-foreground transition-colors">About</a>
      </div>

      <div>
        © {currentYear} DealFlow AI, Inc. Enterprise Confidential.
      </div>
    </footer>
  );
}

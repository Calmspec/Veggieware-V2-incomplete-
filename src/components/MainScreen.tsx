
import { useState, useEffect } from 'react';

interface MainScreenProps {
  onEnter: () => void;
}

const MainScreen = ({ onEnter }: MainScreenProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [scanline, setScanline] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanline((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background grid-bg text-foreground font-mono flex items-center justify-center relative overflow-hidden">
      {/* Animated scanline effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `linear-gradient(to bottom, transparent ${scanline}%, hsl(var(--primary) / 0.1) ${scanline + 1}%, transparent ${scanline + 2}%)`
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-primary/30" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-primary/30" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-primary/30" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-primary/30" />

      <div className="text-center z-20 space-y-12 px-4">
        {/* Logo/Title */}
        <div className="space-y-6">
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-7xl font-bold tracking-widest glow">
              VEGGIEWARE
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="text-lg tracking-[0.3em] text-primary/70 font-semibold">
              OSINT v3.0
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <div className="text-sm text-muted-foreground/60 tracking-wider">
            ADVANCED INTELLIGENCE PLATFORM
          </div>
        </div>

        {/* Enter button */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={onEnter}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            className={`
              relative group
              border-2 border-primary bg-background/50 text-primary 
              px-16 py-6 text-2xl font-bold tracking-[0.5em]
              transition-all duration-200
              hover:bg-primary hover:text-background
              hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]
              ${isPressed ? 'scale-95' : 'hover:scale-105'}
            `}
          >
            <span className="relative z-10">ENTER</span>
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
          </button>

          {/* Status indicators */}
          <div className="flex items-center gap-6 text-xs tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary/70">SYSTEM ONLINE</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-secondary/70">SECURE</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="space-y-2 text-xs text-muted-foreground/40 tracking-wider">
          <div className="flex items-center justify-center gap-2">
            <span>⚠</span>
            <span>AUTHORIZED ACCESS ONLY</span>
            <span>⚠</span>
          </div>
          <div>© 2025 VEGGIEWARE SYSTEMS</div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;

import { useState, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: (username: string, password: string, userAgent: string, ip: string) => Promise<boolean>;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [userIP, setUserIP] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Get user IP
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIP(data.ip))
      .catch(() => setUserIP('Unknown'));

    // Animated loading sequence
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowLogin(true), 200);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('⚠ AUTHENTICATION FAILED: INCOMPLETE CREDENTIALS');
      return;
    }

    const userAgent = navigator.userAgent;
    const success = await onLogin(username, password, userAgent, userIP);
    
    if (!success) {
      setError('⚠ ACCESS DENIED: INVALID CREDENTIALS');
      setUsername('');
      setPassword('');
    }
  };

  if (!showLogin) {
    return (
      <div className="min-h-screen bg-background grid-bg text-foreground font-mono p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-8">
          {/* BIOS Header */}
          <div className="border-2 border-primary/50 p-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-primary font-bold">VEGGIEWARE BIOS</span>
              <span className="text-muted-foreground text-sm">v3.0.1</span>
            </div>
            <div className="h-px bg-gradient-to-r from-primary/50 via-primary to-primary/50 mb-4" />
            
            {/* Boot sequence */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>Initializing secure boot sequence...</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>Loading OSINT modules...</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary">✓</span>
                <span>Establishing encrypted channels...</span>
              </div>
              <div className="flex items-center gap-3">
                {loadingProgress >= 100 ? <span className="text-primary">✓</span> : <span className="text-secondary animate-pulse">●</span>}
                <span>Authentication system online...</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                <span>LOADING</span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="h-2 bg-muted/30 border border-primary/30 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-100"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg text-foreground font-mono flex items-center justify-center p-4">
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-primary/20" />
      <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-primary/20" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-primary/20" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-primary/20" />

      <div className="w-full max-w-md relative z-10">
        <div className="border-2 border-primary/70 bg-card/90 backdrop-blur-md shadow-[0_0_50px_rgba(0,255,100,0.2)] p-8">
          {/* Header */}
          <div className="text-center mb-8 space-y-3">
            <div className="relative inline-block">
              <h1 className="text-3xl font-bold tracking-wider text-primary glow">
                VEGGIEWARE
              </h1>
              <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
            <div className="text-sm text-muted-foreground tracking-wider">
              OSINT INTELLIGENCE TERMINAL
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-destructive/70">
              <span>⚠</span>
              <span>AUTHORIZED PERSONNEL ONLY</span>
              <span>⚠</span>
            </div>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs mb-2 text-primary tracking-wider">
                ▸ USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-input border border-primary/40 text-foreground p-3 font-mono text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,100,0.3)] transition-all"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                placeholder="Enter credentials..."
              />
            </div>

            <div>
              <label className="block text-xs mb-2 text-primary tracking-wider">
                ▸ PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input border border-primary/40 text-foreground p-3 font-mono text-sm focus:outline-none focus:border-primary focus:shadow-[0_0_10px_rgba(0,255,100,0.3)] transition-all"
                autoComplete="off"
                placeholder="******************"
              />
            </div>

            {error && (
              <div className="border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm text-center font-semibold tracking-wide">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full border-2 border-primary bg-primary/10 text-primary p-3 hover:bg-primary hover:text-background transition-all font-bold tracking-widest hover:shadow-[0_0_20px_rgba(0,255,100,0.5)] group"
            >
              <span className="flex items-center justify-center gap-2">
                <span>→</span>
                <span>AUTHENTICATE</span>
                <span>←</span>
              </span>
            </button>
          </form>

          {/* Footer info */}
          <div className="mt-6 pt-6 border-t border-primary/20 space-y-2 text-xs text-muted-foreground/60 text-center">
            <div className="flex items-center justify-between">
              <span>SESSION:</span>
              <span className="font-mono">{new Date().toISOString().split('T')[0]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>IP ADDRESS:</span>
              <span className="font-mono text-primary/60">{userIP}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

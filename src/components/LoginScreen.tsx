
import { useState, useEffect } from 'react';

interface LoginScreenProps {
  onLogin: (username: string, password: string, userAgent: string, ip: string) => boolean;
}

const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [userIP, setUserIP] = useState('');

  useEffect(() => {
    // Get user IP
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIP(data.ip))
      .catch(() => setUserIP('Unknown'));

    // Show BIOS loading sequence
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Access denied: Invalid credentials');
      return;
    }

    const userAgent = navigator.userAgent;
    const success = onLogin(username, password, userAgent, userIP);
    
    if (!success) {
      setError('Access denied: Invalid credentials');
      setUsername('');
      setPassword('');
    }
  };

  if (!showLogin) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono p-4 overflow-hidden">
        <div className="animate-pulse">
          <div className="mb-2">VEGGIEWARE BIOS v2.4.1</div>
          <div className="mb-2">Initializing secure boot sequence...</div>
          <div className="mb-2">Loading OSINT modules... [████████████████████████████████] 100%</div>
          <div className="mb-2">Establishing encrypted channels...</div>
          <div className="mb-2">Authentication system online</div>
          <div className="mt-4 animate-bounce">►</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
      <div className="w-full max-w-md p-8 border border-green-400 bg-black">
        <div className="text-center mb-8">
          <h1 className="text-2xl mb-2">VEGGIEWARE v1.0</h1>
          <div className="text-sm opacity-75">OSINT Intelligence Terminal</div>
          <div className="text-xs mt-2 opacity-50">Authorized Personnel Only</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">USERNAME:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-green-400 text-green-400 p-2 font-mono focus:outline-none focus:border-green-300"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">PASSWORD:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-green-400 text-green-400 p-2 font-mono focus:outline-none focus:border-green-300"
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full border border-green-400 bg-black text-green-400 p-2 hover:bg-green-400 hover:text-black transition-colors font-mono"
          >
            AUTHENTICATE
          </button>
        </form>

        <div className="mt-6 text-xs opacity-50 text-center">
          <div>Session: {new Date().toISOString()}</div>
          <div>IP: {userIP}</div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

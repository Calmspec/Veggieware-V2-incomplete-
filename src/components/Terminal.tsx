import { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { executeCommand } from '../utils/commands';

interface TerminalProps {
  user: User;
  onLogout: () => void;
  isLocked: boolean;
}

const Terminal = ({ user, onLogout, isLocked }: TerminalProps) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output'; content: string; timestamp: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on component mount
    inputRef.current?.focus();
    
    // Welcome message with ASCII art
    const welcomeMsg = `
╔══════════════════════════════════════════════════════════════════════════════╗
║  ██╗   ██╗███████╗ ██████╗  ██████╗ ██╗███████╗██╗    ██╗ █████╗ ██████╗ ███████╗ ║
║  ██║   ██║██╔════╝██╔════╝ ██╔════╝ ██║██╔════╝██║    ██║██╔══██╗██╔══██╗██╔════╝ ║
║  ██║   ██║█████╗  ██║  ███╗██║  ███╗██║█████╗  ██║ █╗ ██║███████║██████╔╝█████╗   ║
║  ╚██╗ ██╔╝██╔══╝  ██║   ██║██║   ██║██║██╔══╝  ██║███╗██║██╔══██║██╔══██╗██╔══╝   ║
║   ╚████╔╝ ███████╗╚██████╔╝╚██████╔╝██║███████╗╚███╔███╔╝██║  ██║██║  ██║███████╗ ║
║    ╚═══╝  ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ║
╚══════════════════════════════════════════════════════════════════════════════╝

        ▓▓▓▓▓▓▓  OSINT INTELLIGENCE TERMINAL v3.0  ▓▓▓▓▓▓▓
        
┌─────────────────────────────────────────────────────────────────────┐
│ SESSION ESTABLISHED                                                 │
│ ─────────────────────────────────────────────────────────────────── │
│ User:        ${user.username}                                       │
│ Role:        ${user.role.toUpperCase()}                             │
│ Session ID:  ${user.loginTime.slice(0, 8)}                          │
│ Access:      ${user.role === 'admin' ? 'UNRESTRICTED' : 'STANDARD'} │
│ Timestamp:   ${new Date().toLocaleString()}                         │
└─────────────────────────────────────────────────────────────────────┘

[✓] System initialized successfully
[✓] 70+ OSINT tools loaded
[✓] Connection to intelligence sources: ACTIVE

Type 'help' for available commands or 'exit' to logout
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    setHistory([{
      type: 'output',
      content: welcomeMsg,
      timestamp: new Date().toISOString()
    }]);
  }, [user]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (isLocked && user.role === 'guest') {
      setHistory(prev => [...prev, {
        type: 'output',
        content: 'ACCESS DENIED: Terminal locked by administrator',
        timestamp: new Date().toISOString()
      }]);
      setInput('');
      return;
    }

    const command = input.trim();
    setInput('');
    
    // Add input to history
    setHistory(prev => [...prev, {
      type: 'input',
      content: `${user.username}@veggieware:~$ ${command}`,
      timestamp: new Date().toISOString()
    }]);

    if (command === 'exit') {
      onLogout();
      return;
    }

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    setIsLoading(true);
    
    try {
      const output = await executeCommand(command, user);
      setHistory(prev => [...prev, {
        type: 'output',
        content: output,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      setHistory(prev => [...prev, {
        type: 'output',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      }]);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-green-400 font-mono overflow-hidden flex flex-col relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      {/* Top status bar */}
      <div className="relative z-10 bg-black/50 backdrop-blur-sm border-b border-green-500/30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
            <span className="text-green-300 font-bold text-sm tracking-wider">VEGGIEWARE v3.0</span>
          </div>
          <div className="h-4 w-px bg-green-500/30"></div>
          <span className="text-green-400/70 text-xs">User: {user.username}</span>
          <span className="text-green-400/70 text-xs">•</span>
          <span className="text-green-400/70 text-xs">Role: {user.role.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400/50 text-xs">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div 
        ref={terminalRef}
        className="relative z-10 flex-1 p-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-green-500/30 hover:scrollbar-thumb-green-500/50"
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        {history.map((item, index) => (
          <div key={index} className={`mb-2 ${item.type === 'input' ? 'text-green-300' : 'text-green-400'}`}>
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">{item.content}</pre>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-3 text-green-400 mt-4">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm">Processing command...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 p-4 border-t border-green-500/30 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 bg-gray-950/50 rounded-lg px-4 py-3 border border-green-500/20 focus-within:border-green-500/50 transition-colors">
          <span className="text-green-300 font-bold text-sm">{user.username}@veggieware</span>
          <span className="text-green-500/50">:</span>
          <span className="text-blue-400">~</span>
          <span className="text-green-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-green-400 outline-none font-mono text-sm placeholder-green-500/30"
            placeholder="Enter command..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={isLoading}
          />
          <span className="animate-pulse text-green-400">█</span>
        </div>
      </form>
    </div>
  );
};

export default Terminal;

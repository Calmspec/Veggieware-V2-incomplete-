import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { User } from '../types';
import { executeCommand } from '../utils/commands';

interface TerminalProps {
  user: User;
  onLogout: () => void;
  isLocked: boolean;
}

const Terminal = ({ user, onLogout, isLocked }: TerminalProps) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Welcome message
    const welcomeMsg = [
      '',
      '╔══════════════════════════════════════════════════════════════╗',
      '║              VEGGIEWARE OSINT TERMINAL v3.0                  ║',
      '╚══════════════════════════════════════════════════════════════╝',
      '',
      `Welcome, ${user.username}!`,
      `Role: ${user.role.toUpperCase()}`,
      `Session: ${new Date().toLocaleString()}`,
      '',
      "Type 'help' to see all available commands",
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
      ''
    ];
    setOutput(welcomeMsg);
  }, [user]);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      const scrollArea = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [output]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() && !isLoading) {
      if (isLocked && user.role === 'guest') {
        setOutput(prev => [...prev, `guest@osint:~$ ${input}`, 'ACCESS DENIED: Terminal locked by administrator', '']);
        setInput('');
        return;
      }

      const command = input.trim();
      setOutput(prev => [...prev, `${user.username}@osint:~$ ${command}`]);
      setInput('');

      if (command === 'exit') {
        onLogout();
        return;
      }

      if (command === 'clear') {
        setOutput([]);
        return;
      }

      setIsLoading(true);
      
      try {
        const result = await executeCommand(command, user);
        setOutput(prev => [...prev, result, '']);
      } catch (error) {
        setOutput(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, '']);
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background via-background to-background/95">
      {/* Modern header with glass effect */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary blur-sm" />
            </div>
            <span className="text-sm font-mono text-foreground font-bold tracking-wide">VEGGIEWARE OSINT</span>
          </div>
          <div className="h-5 w-px bg-border/60" />
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md">
            <span className="text-xs font-mono text-muted-foreground font-medium">
              {user.username}
            </span>
            <div className="h-3 w-px bg-border/40" />
            <span className="text-xs font-mono text-primary/80 uppercase tracking-wider">
              {user.role}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-muted-foreground/70 tabular-nums">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Terminal output with enhanced styling */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-6 font-mono text-[13px] space-y-0.5">
          {output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap break-words leading-relaxed">
              {line.startsWith(`${user.username}@osint`) || line.startsWith('guest@osint') ? (
                <div className="text-primary font-bold my-1.5 flex items-center gap-2">
                  <span className="text-primary/60">▸</span>
                  {line}
                </div>
              ) : line.includes('═') || line.includes('─') || line.includes('┌') || line.includes('└') || line.includes('│') || line.includes('╔') || line.includes('╚') || line.includes('║') ? (
                <span className="text-primary/70 font-semibold">{line}</span>
              ) : line.startsWith('•') ? (
                <span className="text-foreground/90 pl-2">{line}</span>
              ) : line.startsWith('✓') ? (
                <span className="text-green-500 font-medium">{line}</span>
              ) : line.startsWith('✗') ? (
                <span className="text-red-500 font-medium">{line}</span>
              ) : line.includes('://') ? (
                <span className="text-blue-400 underline decoration-blue-400/30 hover:text-blue-300 transition-colors">{line}</span>
              ) : line.startsWith('Usage:') || line.includes('Tip:') ? (
                <span className="text-cyan-400 font-medium italic">{line}</span>
              ) : line.includes('WARNING') || line.includes('⚠️') ? (
                <span className="text-yellow-400 font-bold">{line}</span>
              ) : line.includes('Error:') || line.includes('DENIED') || line.includes('failed') ? (
                <span className="text-red-400 font-bold">{line}</span>
              ) : line.trim() === '' ? (
                <span className="block h-1" />
              ) : (
                <span className="text-muted-foreground/80">{line}</span>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-3 text-primary my-2 animate-pulse">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce shadow-sm shadow-primary/30" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce shadow-sm shadow-primary/30" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/80 animate-bounce shadow-sm shadow-primary/30" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm font-medium">Processing query...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Modern input area */}
      <div className="border-t border-border/50 bg-card/90 backdrop-blur-sm px-6 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-primary font-mono font-bold text-sm shrink-0 flex items-center gap-2">
            <span className="text-primary/60">▸</span>
            {user.username}@osint:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:placeholder:text-muted-foreground/30 transition-all"
            placeholder="Type 'help' for command list..."
            autoFocus
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;

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
    <div className="h-full flex flex-col bg-background">
      {/* Clean header */}
      <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-mono text-foreground font-semibold">OSINT Terminal</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="text-xs font-mono text-muted-foreground">
            {user.username} • {user.role}
          </span>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Terminal output */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-6 font-mono text-sm space-y-1">
          {output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap break-words leading-relaxed">
              {line.startsWith(`${user.username}@osint`) || line.startsWith('guest@osint') ? (
                <div className="text-primary font-semibold">
                  {line}
                </div>
              ) : line.includes('═') || line.includes('─') || line.includes('┌') || line.includes('└') || line.includes('│') || line.includes('╔') || line.includes('╚') || line.includes('║') ? (
                <span className="text-primary/80">{line}</span>
              ) : line.startsWith('•') || line.startsWith('✓') || line.startsWith('✗') ? (
                <span className="text-foreground">{line}</span>
              ) : line.includes('://') ? (
                <span className="text-blue-500">{line}</span>
              ) : line.startsWith('Usage:') || line.includes('WARNING') || line.includes('⚠️') ? (
                <span className="text-yellow-500 font-medium">{line}</span>
              ) : line.includes('Error:') || line.includes('DENIED') ? (
                <span className="text-red-500 font-medium">{line}</span>
              ) : (
                <span className="text-muted-foreground">{line}</span>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-primary">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm">Processing...</span>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Clean input area */}
      <div className="border-t border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-primary font-mono font-semibold text-sm shrink-0">
            {user.username}@osint:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground placeholder:text-muted-foreground/40"
            placeholder="Type 'help' to see all commands..."
            autoFocus
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;

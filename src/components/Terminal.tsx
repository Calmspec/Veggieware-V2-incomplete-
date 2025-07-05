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
    
    // Welcome message
    const welcomeMsg = `VEGGIEWARE 2.0 - OSINT Intelligence Terminal
Authenticated as: ${user.username}
Session ID: ${user.loginTime}
Type 'help' for available commands or 'exit' to logout`;
    
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
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden flex flex-col">
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-track-black scrollbar-thumb-green-400"
        style={{ maxHeight: 'calc(100vh - 60px)' }}
      >
        {history.map((item, index) => (
          <div key={index} className={`mb-1 ${item.type === 'input' ? 'text-green-300' : 'text-green-400'}`}>
            <pre className="whitespace-pre-wrap font-mono text-sm">{item.content}</pre>
          </div>
        ))}
        
        {isLoading && (
          <div className="text-green-400 animate-pulse">
            Processing command...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-green-400">
        <div className="flex items-center">
          <span className="text-green-300 mr-2">{user.username}@veggieware:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-green-400 outline-none font-mono"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={isLoading}
          />
          <span className="animate-pulse text-green-400 ml-1">█</span>
        </div>
      </form>
    </div>
  );
};

export default Terminal;

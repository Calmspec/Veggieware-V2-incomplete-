import { useState, useEffect } from 'react';
import { User, LoginAttempt } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminPanelProps {
  user: User;
  loginAttempts: LoginAttempt[];
  onLogout: () => void;
  isLocked: boolean;
  onToggleLock: (locked: boolean) => void;
  onClearLogs: () => void;
  onRefreshLogs: () => void;
}

const AdminPanel = ({ user, loginAttempts, onLogout, isLocked, onToggleLock, onClearLogs, onRefreshLogs }: AdminPanelProps) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  useEffect(() => {
    onRefreshLogs();
  }, [onRefreshLogs]);

  const handleClearLogs = () => {
    if (showConfirmClear) {
      onClearLogs();
      setShowConfirmClear(false);
    } else {
      setShowConfirmClear(true);
      setTimeout(() => setShowConfirmClear(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg text-foreground font-mono">
      {/* Modern header */}
      <div className="border-b-2 border-primary/30 bg-card/80 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h1 className="text-xl font-bold tracking-wider text-primary">VEGGIEWARE ADMIN</h1>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="text-primary/70">▸</span>
            <span>Administrator: {user.username}</span>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="border-2 border-primary/50 bg-primary/10 text-primary px-6 py-2 hover:bg-primary hover:text-background transition-all font-bold tracking-wider hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        >
          LOGOUT
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="logins" className="w-full">
          <TabsList className="bg-card/50 border-2 border-primary/30 text-foreground p-1 backdrop-blur-sm">
            <TabsTrigger 
              value="logins" 
              className="data-[state=active]:bg-primary data-[state=active]:text-background font-bold tracking-wider"
            >
              LOGINS & IP DATA
            </TabsTrigger>
            <TabsTrigger 
              value="monitoring" 
              className="data-[state=active]:bg-primary data-[state=active]:text-background font-bold tracking-wider"
            >
              SYSTEM MONITORING
            </TabsTrigger>
            <TabsTrigger 
              value="controls" 
              className="data-[state=active]:bg-primary data-[state=active]:text-background font-bold tracking-wider"
            >
              ACCESS CONTROLS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logins" className="mt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-primary tracking-wider">LOGIN ATTEMPTS & IP TRACKING</h2>
                <div className="space-x-3">
                  <button 
                    onClick={handleClearLogs}
                    className={`border-2 px-4 py-2 transition-all font-bold tracking-wider ${
                      showConfirmClear 
                        ? 'border-destructive bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground' 
                        : 'border-primary/50 bg-primary/10 text-primary hover:bg-primary hover:text-background'
                    }`}
                  >
                    {showConfirmClear ? 'CONFIRM CLEAR' : 'CLEAR LOGS'}
                  </button>
                  <button 
                    onClick={onRefreshLogs}
                    className="border-2 border-secondary/50 bg-secondary/10 text-secondary px-4 py-2 hover:bg-secondary hover:text-background transition-all font-bold tracking-wider"
                  >
                    REFRESH
                  </button>
                </div>
              </div>

              <div className="border-2 border-primary/30 overflow-hidden bg-card/50 backdrop-blur-sm">
                <table className="w-full text-sm">
                  <thead className="bg-primary/20 border-b-2 border-primary/30">
                    <tr>
                      <th className="p-3 text-left font-bold tracking-wider text-primary">TIMESTAMP</th>
                      <th className="p-3 text-left font-bold tracking-wider text-primary">USERNAME</th>
                      <th className="p-3 text-left font-bold tracking-wider text-primary">IP ADDRESS</th>
                      <th className="p-3 text-left font-bold tracking-wider text-primary">USER AGENT</th>
                      <th className="p-3 text-left font-bold tracking-wider text-primary">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginAttempts.map((attempt, idx) => (
                      <tr key={attempt.id} className={`border-b border-primary/20 ${idx % 2 === 0 ? 'bg-background/30' : 'bg-background/10'}`}>
                        <td className="p-3 font-mono text-xs">{new Date(attempt.timestamp).toLocaleString()}</td>
                        <td className="p-3 font-semibold">{attempt.username}</td>
                        <td className="p-3 font-mono text-secondary/80">{attempt.ip}</td>
                        <td className="p-3 truncate max-w-xs text-muted-foreground text-xs">{attempt.userAgent}</td>
                        <td className={`p-3 font-bold ${attempt.success ? 'text-primary' : 'text-destructive'}`}>
                          {attempt.success ? '✓ SUCCESS' : '✗ FAILED'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loginAttempts.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">No login attempts recorded</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary tracking-wider">REAL-TIME SYSTEM STATUS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-primary/30 bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-sm font-bold mb-4 text-primary tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    ACTIVE SESSIONS
                  </h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current User:</span>
                      <span className="font-bold text-primary">{user.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Login Time:</span>
                      <span className="font-mono text-xs">{new Date(user.loginTime).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IP Address:</span>
                      <span className="font-mono text-secondary">{user.ip}</span>
                    </div>
                  </div>
                </div>
                <div className="border-2 border-secondary/30 bg-card/50 backdrop-blur-sm p-6">
                  <h3 className="text-sm font-bold mb-4 text-secondary tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    SYSTEM STATUS
                  </h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Terminal:</span>
                      <span className="font-bold text-primary">✓ ONLINE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">OSINT APIs:</span>
                      <span className="font-bold text-primary">✓ ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Security:</span>
                      <span className={`font-bold ${isLocked ? 'text-destructive' : 'text-primary'}`}>
                        {isLocked ? '🔒 LOCKED' : '🔓 NORMAL'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="controls" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-primary tracking-wider">ACCESS CONTROL PANEL</h2>
              <div className="border-2 border-primary/30 bg-card/50 backdrop-blur-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold mb-2 text-primary tracking-wider">SITE LOCKDOWN</h3>
                    <p className="text-xs text-muted-foreground">Blocks all Guest access while maintaining Admin privileges</p>
                  </div>
                  <button
                    onClick={() => onToggleLock(!isLocked)}
                    className={`border-2 px-6 py-3 transition-all font-bold tracking-wider ${
                      isLocked 
                        ? 'border-destructive bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]' 
                        : 'border-primary bg-primary/10 text-primary hover:bg-primary hover:text-background hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]'
                    }`}
                  >
                    {isLocked ? '🔓 UNLOCK SYSTEM' : '🔒 LOCK SYSTEM'}
                  </button>
                </div>
                <div className={`text-sm font-semibold p-4 border-2 ${isLocked ? 'border-destructive/30 bg-destructive/10 text-destructive' : 'border-primary/30 bg-primary/10 text-primary'}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: isLocked ? 'hsl(var(--destructive))' : 'hsl(var(--primary))' }} />
                    <span>Status: {isLocked ? 'SYSTEM LOCKED - Guest access denied' : 'SYSTEM UNLOCKED - All users active'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;

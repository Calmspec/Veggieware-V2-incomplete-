
import { useState } from 'react';
import { User, LoginAttempt } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminPanelProps {
  user: User;
  loginAttempts: LoginAttempt[];
  onLogout: () => void;
  isLocked: boolean;
  onToggleLock: (locked: boolean) => void;
  onClearLogs: () => void;
}

const AdminPanel = ({ user, loginAttempts, onLogout, isLocked, onToggleLock, onClearLogs }: AdminPanelProps) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

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
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header */}
      <div className="border-b border-green-400 p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl">VEGGIE WARE 2.0 - Admin Panel</h1>
          <div className="text-sm opacity-75">Administrator: {user.username}</div>
        </div>
        <button 
          onClick={onLogout}
          className="border border-green-400 px-4 py-1 hover:bg-green-400 hover:text-black transition-colors"
        >
          LOGOUT
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Tabs defaultValue="logins" className="w-full">
          <TabsList className="bg-black border border-green-400 text-green-400">
            <TabsTrigger value="logins" className="data-[state=active]:bg-green-400 data-[state=active]:text-black">
              LOGINS AND IP DATA
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-green-400 data-[state=active]:text-black">
              SYSTEM MONITORING
            </TabsTrigger>
            <TabsTrigger value="controls" className="data-[state=active]:bg-green-400 data-[state=active]:text-black">
              ACCESS CONTROLS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logins" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg">Login Attempts & IP Tracking</h2>
                <div className="space-x-2">
                  <button 
                    onClick={handleClearLogs}
                    className={`border px-3 py-1 transition-colors ${
                      showConfirmClear 
                        ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-black' 
                        : 'border-green-400 hover:bg-green-400 hover:text-black'
                    }`}
                  >
                    {showConfirmClear ? 'CONFIRM CLEAR' : 'CLEAR LOGS'}
                  </button>
                  <button className="border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black transition-colors">
                    REFRESH
                  </button>
                </div>
              </div>

              <div className="border border-green-400 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-green-400 text-black">
                    <tr>
                      <th className="p-2 text-left">TIMESTAMP</th>
                      <th className="p-2 text-left">USERNAME</th>
                      <th className="p-2 text-left">IP ADDRESS</th>
                      <th className="p-2 text-left">USER AGENT</th>
                      <th className="p-2 text-left">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginAttempts.map((attempt) => (
                      <tr key={attempt.id} className="border-b border-green-400">
                        <td className="p-2">{new Date(attempt.timestamp).toLocaleString()}</td>
                        <td className="p-2">{attempt.username}</td>
                        <td className="p-2">{attempt.ip}</td>
                        <td className="p-2 truncate max-w-xs">{attempt.userAgent}</td>
                        <td className={`p-2 ${attempt.success ? 'text-green-400' : 'text-red-400'}`}>
                          {attempt.success ? 'SUCCESS' : 'FAILED'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loginAttempts.length === 0 && (
                  <div className="p-4 text-center opacity-50">No login attempts recorded</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="mt-4">
            <div className="space-y-4">
              <h2 className="text-lg">Real-Time System Status</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-green-400 p-4">
                  <h3 className="text-sm mb-2">ACTIVE SESSIONS</h3>
                  <div className="text-sm">
                    <div>Current User: {user.username}</div>
                    <div>Login Time: {new Date(user.loginTime).toLocaleString()}</div>
                    <div>IP: {user.ip}</div>
                  </div>
                </div>
                <div className="border border-green-400 p-4">
                  <h3 className="text-sm mb-2">SYSTEM STATUS</h3>
                  <div className="text-sm space-y-1">
                    <div>Terminal Status: ONLINE</div>
                    <div>OSINT APIs: ACTIVE</div>
                    <div>Security Level: {isLocked ? 'LOCKED' : 'NORMAL'}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="controls" className="mt-4">
            <div className="space-y-4">
              <h2 className="text-lg">Access Control Panel</h2>
              <div className="border border-green-400 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm">SITE LOCKDOWN</h3>
                    <p className="text-xs opacity-75">Blocks all Guest access while maintaining Admin privileges</p>
                  </div>
                  <button
                    onClick={() => onToggleLock(!isLocked)}
                    className={`border px-4 py-2 transition-colors ${
                      isLocked 
                        ? 'border-red-400 text-red-400 hover:bg-red-400 hover:text-black' 
                        : 'border-green-400 hover:bg-green-400 hover:text-black'
                    }`}
                  >
                    {isLocked ? 'UNLOCK SYSTEM' : 'LOCK SYSTEM'}
                  </button>
                </div>
                <div className={`text-sm ${isLocked ? 'text-red-400' : 'text-green-400'}`}>
                  Status: {isLocked ? 'SYSTEM LOCKED - Guest access denied' : 'SYSTEM UNLOCKED - All users active'}
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

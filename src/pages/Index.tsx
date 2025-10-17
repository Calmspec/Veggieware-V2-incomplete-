
import { useState, useEffect } from 'react';
import MainScreen from '../components/MainScreen';
import LoginScreen from '../components/LoginScreen';
import Terminal from '../components/Terminal';
import AdminPanel from '../components/AdminPanel';
import { User, LoginAttempt } from '../types';
import { api } from '../lib/api';

const Index = () => {
  const [showMainScreen, setShowMainScreen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  // Check lock status on mount and periodically
  useEffect(() => {
    const checkLockStatus = async () => {
      try {
        const response = await api.checkLockStatus();
        setIsLocked(response.isLocked);
      } catch (error) {
        console.error('Failed to check lock status:', error);
      }
    };

    checkLockStatus();
    
    // Check lock status every 30 seconds
    const interval = setInterval(checkLockStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Load login logs on mount
  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await api.getVisitorLogs();
        const convertedLogs = data.logs
          .filter((log: any) => log.action === 'successful_login' || log.action === 'failed_login')
          .map((log: any) => ({
            id: log.id?.toString() || Date.now().toString(),
            username: log.username,
            timestamp: log.created_at,
            success: log.action === 'successful_login',
            ip: log.ip_address,
            userAgent: log.user_agent
          }));
        setLoginAttempts(convertedLogs);
      } catch (error) {
        console.error('Failed to load logs:', error);
      }
    };

    loadLogs();
  }, []);

  const handleEnter = () => {
    setShowMainScreen(false);
  };

  const handleLogin = async (username: string, password: string, userAgent: string, providedIp?: string) => {
    // Always fetch fresh IP address for each login attempt
    let realIp = 'Unknown';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      realIp = ipData.ip;
    } catch (error) {
      console.log('Failed to get IP:', error);
      realIp = providedIp || 'Unknown';
    }

    // Check if site is locked and user is Guest - prevent login entirely
    if (isLocked && username === 'Guest') {
      // Log failed attempt to backend
      try {
        await api.logVisitor(username, userAgent, 'failed_login');
      } catch (error) {
        console.error('Failed to log failed login:', error);
      }
      
      // Refresh logs to show the failed attempt
      await handleRefreshLogs();
      return false;
    }

    // Validate credentials - Guest password is "Veggies", Admin password is "VeggiesAdmin"
    const isValidCredentials = 
      (username === 'Guest' && password === 'Veggies') || 
      (username === 'Admin' && password === 'VeggiesAdmin');
    
    // Log the login attempt to backend
    try {
      const action = isValidCredentials ? 'successful_login' : 'failed_login';
      await api.logVisitor(username, userAgent, action);
    } catch (error) {
      console.error('Failed to log login attempt:', error);
    }

    if (isValidCredentials) {
      const timestamp = new Date().toISOString();
      setUser({
        username,
        role: username === 'Admin' ? 'admin' : 'guest',
        loginTime: timestamp,
        ip: realIp,
        userAgent
      });
      
      // Refresh logs after successful login
      await handleRefreshLogs();
      return true;
    }

    // Refresh logs after failed login
    await handleRefreshLogs();
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setShowMainScreen(true);
  };

  const handleRefreshLogs = async () => {
    try {
      const data = await api.getVisitorLogs();
      // Convert visitor logs to login attempts format for display
      const convertedLogs = data.logs
        .filter((log: any) => log.action === 'successful_login' || log.action === 'failed_login')
        .map((log: any) => ({
          id: log.id?.toString() || Date.now().toString(),
          username: log.username,
          timestamp: log.created_at,
          success: log.action === 'successful_login',
          ip: log.ip_address,
          userAgent: log.user_agent
        }));
      setLoginAttempts(convertedLogs);
    } catch (error) {
      console.error('Failed to refresh logs:', error);
    }
  };

  if (showMainScreen) {
    return <MainScreen onEnter={handleEnter} />;
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (user.role === 'admin') {
    return (
      <AdminPanel 
        user={user}
        loginAttempts={loginAttempts}
        onLogout={handleLogout}
        isLocked={isLocked}
        onToggleLock={async (locked: boolean) => {
          try {
            await api.setLockStatus(locked);
            setIsLocked(locked);
          } catch (error) {
            console.error('Failed to toggle lock:', error);
          }
        }}
        onClearLogs={async () => {
          try {
            await api.clearVisitorLogs();
            setLoginAttempts([]);
            await handleRefreshLogs();
          } catch (error) {
            console.error('Failed to clear logs:', error);
          }
        }}
        onRefreshLogs={handleRefreshLogs}
      />
    );
  }

  return <Terminal user={user} onLogout={handleLogout} isLocked={isLocked} />;
};

export default Index;

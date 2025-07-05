
import { useState, useEffect } from 'react';
import MainScreen from '../components/MainScreen';
import LoginScreen from '../components/LoginScreen';
import Terminal from '../components/Terminal';
import AdminPanel from '../components/AdminPanel';
import { User, LoginAttempt } from '../types';

const Index = () => {
  const [showMainScreen, setShowMainScreen] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [isLocked, setIsLocked] = useState(false);

  const handleEnter = () => {
    setShowMainScreen(false);
  };

  const handleLogin = async (username: string, password: string, userAgent: string, providedIp?: string) => {
    // Check if site is locked and user is Guest - prevent login entirely
    if (isLocked && username === 'Guest') {
      const timestamp = new Date().toISOString();
      let realIp = providedIp || 'Unknown';
      
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        realIp = ipData.ip;
      } catch (error) {
        console.log('Failed to get IP:', error);
      }

      const attempt: LoginAttempt = {
        id: Date.now().toString(),
        username,
        ip: realIp,
        userAgent,
        timestamp,
        success: false
      };
      
      setLoginAttempts(prev => [...prev, attempt]);
      return false;
    }

    const timestamp = new Date().toISOString();
    
    // Always fetch fresh IP address for each login attempt
    let realIp = 'Unknown';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      realIp = ipData.ip;
      console.log('Fetched IP for login:', realIp);
    } catch (error) {
      console.log('Failed to get IP:', error);
      // Fallback to provided IP if available
      realIp = providedIp || 'Unknown';
    }

    const attempt: LoginAttempt = {
      id: Date.now().toString(),
      username,
      ip: realIp,
      userAgent,
      timestamp,
      success: false
    };

    // Validate credentials - Fixed Guest password to "Veggies"
    if ((username === 'Guest' && password === 'Veggies') || 
        (username === 'Admin' && password === 'VeggiesAdmin')) {
      
      attempt.success = true;
      setUser({
        username,
        role: username === 'Admin' ? 'admin' : 'guest',
        loginTime: timestamp,
        ip: realIp,
        userAgent
      });
      setLoginAttempts(prev => [...prev, attempt]);
      return true;
    }

    setLoginAttempts(prev => [...prev, attempt]);
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setShowMainScreen(true);
  };

  const handleRefreshLogs = async () => {
    // Force refresh IP logs by making a test request
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      console.log('Refreshed - Current IP:', ipData.ip);
    } catch (error) {
      console.log('Refresh failed:', error);
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
        onToggleLock={setIsLocked}
        onClearLogs={() => setLoginAttempts([])}
        onRefreshLogs={handleRefreshLogs}
      />
    );
  }

  return <Terminal user={user} onLogout={handleLogout} isLocked={isLocked} />;
};

export default Index;


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
    const timestamp = new Date().toISOString();
    
    // Get the user's real IP address
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

    // Validate credentials
    if ((username === 'Guest' && password === 'Veggies') || 
        (username === 'Admin' && password === 'VeggiesAdmin')) {
      
      // Check if site is locked and user is Guest
      if (isLocked && username === 'Guest') {
        setLoginAttempts(prev => [...prev, { ...attempt, success: false }]);
        return false;
      }

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
      />
    );
  }

  return <Terminal user={user} onLogout={handleLogout} isLocked={isLocked} />;
};

export default Index;

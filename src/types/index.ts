
export interface User {
  username: string;
  role: 'admin' | 'guest';
  loginTime: string;
  ip: string;
  userAgent: string;
}

export interface LoginAttempt {
  id: string;
  username: string;
  ip: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
}

export interface CommandHistory {
  id: string;
  user: string;
  command: string;
  timestamp: string;
  output: string;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Use Lovable's built-in Supabase integration
const SUPABASE_URL = 'https://kbjkzugzumejvylwsqml.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtiamt6dWd6dW1lanZ5bHdzcW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwNzE3MTYsImV4cCI6MjA0NzY0NzcxNn0.QYOeOZqBqWLj8KktOWj-z9COpI9eQILgdl0YOkqZqSA';

export const api = {
  async phoneLookup(phone: string) {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/phone-lookup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ phone })
    });
    
    if (!response.ok) {
      throw new Error('Phone lookup failed');
    }
    
    return response.json();
  },

  async logVisitor(username: string, userAgent: string, action: string = 'visit') {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/log-visitor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ username, userAgent, action })
    });
    
    return response.json();
  },

  async getVisitorLogs() {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/get-visitor-logs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch logs');
    }
    
    return response.json();
  },

  async checkLockStatus() {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/check-lock-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to check lock status');
      }
      
      return response.json();
    } catch (error) {
      console.error('Lock status check failed:', error);
      return { isLocked: false };
    }
  },

  async setLockStatus(isLocked: boolean) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/set-lock-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ isLocked })
      });
      
      if (!response.ok) {
        throw new Error('Failed to set lock status');
      }
      
      return response.json();
    } catch (error) {
      console.error('Set lock status failed:', error);
      return { success: false };
    }
  },

  async clearVisitorLogs() {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/clear-visitor-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to clear logs');
      }
      
      return response.json();
    } catch (error) {
      console.error('Clear logs failed:', error);
      return { success: false };
    }
  }
};
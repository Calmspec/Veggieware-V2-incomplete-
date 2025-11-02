// Use Lovable Cloud Supabase integration
const SUPABASE_URL = 'https://rvlsheilakxhgazpcmad.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2bHNoZWlsYWt4aGdhenBjbWFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MDU4NDQsImV4cCI6MjA3NjM4MTg0NH0.pTuDPB36HxZPUx20nnmXJHrw1H6otoe7XmkhwdzbPqg';

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
  },

  async breachLookup(query: string, queryType: string) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/breach-lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ query, queryType })
      });
      
      if (!response.ok) {
        throw new Error('Breach lookup failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Breach lookup failed:', error);
      return { breaches: [], total: 0, error: error.message };
    }
  },

  async discordLookup(userId: string) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/discord-lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error('Discord lookup failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Discord lookup failed:', error);
      return { error: error.message };
    }
  },

  async ipLookup(ip: string) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/ip-lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ ip })
      });
      
      if (!response.ok) {
        throw new Error('IP lookup failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('IP lookup failed:', error);
      return { error: error.message };
    }
  },

  async whoisLookup(domain: string) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/whois-lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ domain })
      });
      
      if (!response.ok) {
        throw new Error('WHOIS lookup failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('WHOIS lookup failed:', error);
      return { error: error.message };
    }
  },

  async dnsLookup(domain: string) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/dns-lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ domain })
      });
      
      if (!response.ok) {
        throw new Error('DNS lookup failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('DNS lookup failed:', error);
      return { error: error.message };
    }
  },

  async emailVerify(email: string) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/email-verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error('Email verification failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Email verification failed:', error);
      return { error: error.message };
    }
  },

  async usernameSearch(username: string) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/username-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ username })
      });
      
      if (!response.ok) {
        throw new Error('Username search failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Username search failed:', error);
      return { error: error.message };
    }
  },

  async macLookup(mac: string) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/mac-lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ mac })
      });
      
      if (!response.ok) {
        throw new Error('MAC lookup failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('MAC lookup failed:', error);
      return { error: error.message };
    }
  },

  async socialLookup(username: string, platform: string) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/social-lookup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ username, platform })
      });
      
      if (!response.ok) {
        throw new Error('Social lookup failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Social lookup failed:', error);
      return { error: error.message };
    }
  }
};
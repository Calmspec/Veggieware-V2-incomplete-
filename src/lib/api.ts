const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
    // For now, use localStorage as fallback since we need a simple lock mechanism
    const isLocked = localStorage.getItem('veggieware-lock') === 'true';
    return { isLocked };
  },

  async setLockStatus(isLocked: boolean) {
    localStorage.setItem('veggieware-lock', isLocked.toString());
    // Broadcast to other tabs/windows
    window.dispatchEvent(new CustomEvent('veggieware-lock-changed', { detail: { isLocked } }));
    return { success: true };
  }
};
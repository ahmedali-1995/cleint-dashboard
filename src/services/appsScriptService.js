// Google Apps Script service
class AppsScriptService {
  constructor() {
    // Replace this with your deployed Apps Script web app URL
    this.scriptUrl = 'https://script.google.com/macros/s/AKfycbxc1J_oVKZD07d34Qr9tiV-fppbTIeKqkcR46SZWZmSIR5oDLJpeOEtzpoektZr8ASpiw/exec'; // You need to replace this with your actual deployment URL
    this.debug = true;
  }

  async getUserData(username) {
    try {
      if (this.debug) console.log(`[AppsScriptService] Fetching data for username: ${username}`);
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const url = `${this.scriptUrl}?username=${encodeURIComponent(username)}&t=${timestamp}`;
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (this.debug) console.log('[AppsScriptService] Response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch data');
      }
      
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('[AppsScriptService] Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async testConnection() {
    try {
      if (this.debug) console.log('[AppsScriptService] Testing connection...');
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const url = `${this.scriptUrl}?t=${timestamp}`;
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (this.debug) console.log('[AppsScriptService] Test response:', data);
      
      return {
        success: true,
        message: data.message || 'Connection successful'
      };
    } catch (error) {
      console.error('[AppsScriptService] Test connection error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const appsScriptService = new AppsScriptService();

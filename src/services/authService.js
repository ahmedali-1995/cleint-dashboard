const AUTH_KEY = 'client_portal_auth'

class AuthService {
  constructor() {
    console.log('[AuthService] Initializing')
    this.clearAuth() // Start fresh
  }

  setAuth(userData) {
    try {
      if (!userData || !userData.username) {
        console.error('[AuthService] Invalid user data:', userData)
        return false
      }

      const authData = {
        user: userData,
        timestamp: new Date().getTime()
      }

      localStorage.setItem(AUTH_KEY, JSON.stringify(authData))
      console.log('[AuthService] Auth data stored:', authData)
      return true
    } catch (error) {
      console.error('[AuthService] Error setting auth:', error)
      return false
    }
  }

  getAuth() {
    try {
      const rawData = localStorage.getItem(AUTH_KEY)
      
      if (!rawData) {
        console.log('[AuthService] No auth data found')
        return null
      }

      const authData = JSON.parse(rawData)
      
      if (!authData || !authData.user || !authData.user.username) {
        console.log('[AuthService] Invalid auth data structure')
        this.clearAuth()
        return null
      }

      return authData
    } catch (error) {
      console.error('[AuthService] Error getting auth:', error)
      this.clearAuth()
      return null
    }
  }

  getUserDetails() {
    const authData = this.getAuth()
    return authData?.user || null
  }

  getUsername() {
    return this.getUserDetails()?.username || null
  }

  isAuthenticated() {
    try {
      const authData = this.getAuth()
      
      if (!authData || !authData.user || !authData.user.username) {
        return false
      }

      const now = new Date().getTime()
      const authTime = authData.timestamp || 0
      const MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours

      if (now - authTime > MAX_AGE) {
        console.log('[AuthService] Session expired')
        this.clearAuth()
        return false
      }

      return true
    } catch (error) {
      console.error('[AuthService] Error checking auth:', error)
      return false
    }
  }

  clearAuth() {
    try {
      localStorage.removeItem(AUTH_KEY)
      console.log('[AuthService] Auth data cleared')
    } catch (error) {
      console.error('[AuthService] Error clearing auth:', error)
    }
  }
}

export const authService = new AuthService()

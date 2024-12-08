import { defineStore } from 'pinia'
import users from '../../users.json'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),
  
  actions: {
    async login(username, password) {
      const user = users.users.find(u => 
        u.username === username && u.password === password
      )
      
      if (!user) {
        throw new Error('Invalid credentials')
      }
      
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },
    
    initAuth() {
      const user = localStorage.getItem('user')
      if (user) {
        this.user = JSON.parse(user)
      }
    }
  }
})

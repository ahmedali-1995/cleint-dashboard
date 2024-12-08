import { createRouter, createWebHistory } from 'vue-router'
import ClientLogin from '../pages/ClientLogin.vue'
import Dashboard from '../pages/Dashboard.vue'
import { authService } from '../services/authService'

const routes = [
  {
    path: '/',
    redirect: '/client-login'
  },
  {
    path: '/client-login',
    name: 'ClientLogin',
    component: ClientLogin,
    beforeEnter: (to, from, next) => {
      console.log('[Router] Login route guard')
      const authData = authService.getAuth()
      
      if (authData?.user?.username) {
        console.log('[Router] Already logged in, redirecting to dashboard')
        next('/client-dashboard')
      } else {
        console.log('[Router] Not logged in, allowing login access')
        next()
      }
    }
  },
  {
    path: '/client-dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      console.log('[Router] Dashboard route guard')
      const authData = authService.getAuth()
      
      if (!authData?.user?.username) {
        console.log('[Router] Not logged in, redirecting to login')
        next('/client-login')
      } else {
        console.log('[Router] Logged in as:', authData.user.username)
        next()
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

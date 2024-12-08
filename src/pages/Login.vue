<template>
  <div class="min-h-screen flex">
    <!-- Left side with background image -->
    <div class="w-1/2">
      <img 
        src="https://jaridatakhbarak.com/wp-content/uploads/2024/12/Untitled-design.jpg" 
        alt="MORBH" 
        class="w-full h-full object-cover"
      >
    </div>

    <!-- Right side with login form -->
    <div class="w-1/2 flex items-center justify-center p-12 bg-[#001a18]">
      <div class="w-full max-w-md">
        <h1 class="text-5xl font-bold mb-4 text-white">Nice to see you!</h1>
        <p class="text-[#4fd1b3] text-lg mb-8">Enter your username and password to sign in</p>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-white mb-2">Username</label>
            <input
              type="text"
              v-model="username"
              placeholder="Your username..."
              class="login-input"
              required
            >
          </div>

          <div>
            <label class="block text-white mb-2">Password</label>
            <input
              type="password"
              v-model="password"
              placeholder="Your password..."
              class="login-input"
              required
            >
          </div>

          <div class="flex items-center mt-6">
            <label class="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                v-model="rememberMe"
                class="login-checkbox"
              >
              <span class="ml-2 text-white">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            class="login-button"
          >
            SIGN IN
          </button>
          
          <div v-if="error" class="text-red-400 text-center mt-4">
            {{ error }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    await authStore.login(username.value, password.value)
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', 'true')
    }
    router.push('/client-dashboard')
  } catch (err) {
    error.value = 'Invalid username or password'
  }
}
</script>

<style>
.login-input {
  @apply w-full px-4 py-3 rounded-lg;
  background-color: #001a18 !important;
  border: 2px solid #009b7a !important;
  color: white !important;
  box-shadow: 0 0 15px rgba(0, 155, 122, 0.2);
}

.login-input:focus {
  outline: none !important;
  box-shadow: 0 0 20px rgba(0, 155, 122, 0.3) !important;
  background-color: #001a18 !important;
  border-color: #009b7a !important;
}

.login-input::placeholder {
  color: rgba(156, 163, 175, 0.5) !important;
}

.login-checkbox {
  @apply h-5 w-5 rounded;
  border: 2px solid white !important;
  background-color: transparent !important;
}

.login-checkbox:checked {
  background-color: #00a984 !important;
  border-color: #00a984 !important;
}

.login-button {
  @apply w-full py-3 px-4 mt-6 text-white font-medium rounded-lg transition duration-200 text-lg;
  background-color: #00a984 !important;
}

.login-button:hover {
  background-color: #009b7a !important;
}
</style>
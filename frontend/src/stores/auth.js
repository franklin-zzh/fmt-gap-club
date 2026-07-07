import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, fetchMe } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isMember = computed(() => user.value?.role === 'member')

  async function login(email, password) {
    const res = await apiLogin(email, password)
    token.value = res.access_token
    localStorage.setItem('token', res.access_token)
    await loadUser()
    return user.value
  }

  async function register(email, password) {
    await apiRegister(email, password)
    return login(email, password)
  }

  async function loadUser() {
    if (!token.value) return
    try {
      user.value = await fetchMe()
    } catch (e) {
      logout()
    }
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isMember,
    login,
    register,
    loadUser,
    logout,
  }
})

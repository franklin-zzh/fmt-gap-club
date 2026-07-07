import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '@/api/admin'

export const useAdminStore = defineStore('admin', () => {
  const stats = ref(null)
  const users = ref([])
  const subscriptions = ref([])

  async function loadStats() {
    stats.value = await api.fetchDashboardStats()
  }

  async function loadUsers(params = {}) {
    users.value = await api.fetchUsers(params)
  }

  async function toggleStatus(userId) {
    await api.toggleUserStatus(userId)
    await loadUsers()
  }

  async function loadSubscriptions() {
    subscriptions.value = await api.fetchSubscriptions()
  }

  return {
    stats,
    users,
    subscriptions,
    loadStats,
    loadUsers,
    toggleStatus,
    loadSubscriptions,
  }
})

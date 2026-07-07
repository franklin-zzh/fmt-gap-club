<script setup>
import { onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { CreditCard } from '@lucide/vue'

const admin = useAdminStore()
onMounted(() => {
  admin.loadSubscriptions()
  admin.loadUsers()
})

function planLabel(key) {
  return { monthly: '月付', quarterly: '季付', yearly: '年付' }[key] || key
}

function statusLabel(status) {
  return { active: '生效中', expired: '已过期', cancelled: '已取消' }[status] || status
}

function userEmail(userId) {
  const user = admin.users.find(u => u.id === userId)
  return user?.email || `用户 #${userId}`
}
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-ink mb-2">订阅管理</h1>
      <p class="text-ink-muted">查看所有会员的订阅状态与套餐信息。</p>
    </header>

    <div class="bg-cream rounded-[28px] border border-ink/5 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-ink text-canvas text-sm">
          <tr>
            <th class="px-6 py-4 font-medium">会员</th>
            <th class="px-6 py-4 font-medium">套餐</th>
            <th class="px-6 py-4 font-medium">状态</th>
            <th class="px-6 py-4 font-medium">开始时间</th>
            <th class="px-6 py-4 font-medium">到期时间</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr v-for="sub in admin.subscriptions" :key="sub.id" class="border-t border-ink/5 hover:bg-canvas/50">
            <td class="px-6 py-4 text-ink">{{ userEmail(sub.user_id) }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded-full text-xs bg-terracotta/10 text-terracotta flex items-center gap-1 w-fit">
                <CreditCard class="w-3 h-3" /> {{ planLabel(sub.plan_type) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded-full text-xs" :class="sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ statusLabel(sub.status) }}
              </span>
            </td>
            <td class="px-6 py-4 text-ink-muted">{{ new Date(sub.started_at).toLocaleDateString() }}</td>
            <td class="px-6 py-4 text-ink-muted">{{ sub.expired_at ? new Date(sub.expired_at).toLocaleDateString() : '-' }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!admin.subscriptions.length" class="text-center py-12 text-ink-muted">暂无订阅数据</div>
    </div>
  </div>
</template>

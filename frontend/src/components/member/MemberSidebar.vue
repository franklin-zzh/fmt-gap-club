<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard,
  UserCircle,
  ClipboardList,
  FileBarChart,
  CreditCard,
  LogOut,
} from '@lucide/vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const links = [
  { name: 'member-dashboard', label: '工作台', icon: LayoutDashboard },
  { name: 'member-profile', label: '健康档案', icon: UserCircle },
  { name: 'member-submission', label: '定制需求', icon: ClipboardList },
  { name: 'member-reports', label: '分析报告', icon: FileBarChart },
  { name: 'member-subscription', label: '订阅管理', icon: CreditCard },
]

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <aside class="w-64 bg-cream border-r border-ink/5 flex flex-col h-screen sticky top-0">
    <div class="p-6">
      <router-link to="/" class="text-xl font-bold text-ink">FMT 微生态</router-link>
      <p class="text-xs text-ink-muted mt-1">会员工作台</p>
    </div>

    <nav class="flex-1 px-4 space-y-1">
      <router-link
        v-for="link in links"
        :key="link.name"
        :to="{ name: link.name }"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors duration-300',
          route.name === link.name
            ? 'bg-ink text-canvas'
            : 'text-ink-muted hover:bg-ink/5 hover:text-ink'
        ]"
      >
        <component :is="link.icon" class="w-5 h-5" />
        {{ link.label }}
      </router-link>
    </nav>

    <div class="p-4 border-t border-ink/5">
      <div class="flex items-center gap-3 mb-4 px-4">
        <div class="w-9 h-9 rounded-full bg-sage/30 flex items-center justify-center text-sm font-bold text-ink">
          {{ auth.user?.email?.[0]?.toUpperCase() || 'M' }}
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-medium text-ink truncate">{{ auth.user?.email }}</p>
          <p class="text-xs text-ink-muted">会员</p>
        </div>
      </div>
      <button
        @click="logout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-ink-muted hover:bg-red-50 hover:text-red-500 transition-colors duration-300"
      >
        <LogOut class="w-5 h-5" />
        退出登录
      </button>
    </div>
  </aside>
</template>

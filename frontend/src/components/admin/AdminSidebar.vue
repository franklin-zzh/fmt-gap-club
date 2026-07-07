<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutDashboard,
  Users,
  Package,
  BookOpen,
  CreditCard,
  LogOut,
} from '@lucide/vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const links = [
  { name: 'admin-dashboard', label: '数据仪表盘', icon: LayoutDashboard },
  { name: 'admin-members', label: '会员管理', icon: Users },
  { name: 'admin-products', label: '产品管理', icon: Package },
  { name: 'admin-articles', label: '知识库管理', icon: BookOpen },
  { name: 'admin-subscriptions', label: '订阅管理', icon: CreditCard },
]

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <aside class="w-64 bg-ink text-canvas flex flex-col h-screen sticky top-0">
    <div class="p-6">
      <router-link to="/" class="text-xl font-bold text-canvas">FMT 微生态</router-link>
      <p class="text-xs text-canvas/50 mt-1">管理后台</p>
    </div>

    <nav class="flex-1 px-4 space-y-1">
      <router-link
        v-for="link in links"
        :key="link.name"
        :to="{ name: link.name }"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-colors duration-300',
          route.name === link.name
            ? 'bg-canvas text-ink'
            : 'text-canvas/70 hover:bg-canvas/10 hover:text-canvas'
        ]"
      >
        <component :is="link.icon" class="w-5 h-5" />
        {{ link.label }}
      </router-link>
    </nav>

    <div class="p-4 border-t border-canvas/10">
      <div class="flex items-center gap-3 mb-4 px-4">
        <div class="w-9 h-9 rounded-full bg-terracotta/30 flex items-center justify-center text-sm font-bold text-canvas">
          {{ auth.user?.email?.[0]?.toUpperCase() || 'A' }}
        </div>
        <div class="overflow-hidden">
          <p class="text-sm font-medium text-canvas truncate">{{ auth.user?.email }}</p>
          <p class="text-xs text-canvas/50">管理员</p>
        </div>
      </div>
      <button
        @click="logout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-canvas/70 hover:bg-canvas/10 hover:text-canvas transition-colors duration-300"
      >
        <LogOut class="w-5 h-5" />
        退出登录
      </button>
    </div>
  </aside>
</template>

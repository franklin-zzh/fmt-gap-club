<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { Search, Ban, CheckCircle } from '@lucide/vue'

const admin = useAdminStore()
const q = ref('')

onMounted(() => admin.loadUsers())

async function search() {
  await admin.loadUsers({ q: q.value })
}

async function toggleStatus(user) {
  await admin.toggleStatus(user.id)
}
</script>

<template>
  <div>
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-ink mb-2">会员管理</h1>
        <p class="text-ink-muted">查看、搜索与管理会员账户状态。</p>
      </div>
    </header>

    <div class="bg-cream rounded-[28px] p-6 border border-ink/5 mb-6">
      <div class="relative max-w-md">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input
          v-model="q"
          @keyup.enter="search"
          type="text"
          placeholder="搜索邮箱…"
          class="w-full pl-10 pr-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none"
        />
      </div>
    </div>

    <div class="bg-cream rounded-[28px] border border-ink/5 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-ink text-canvas text-sm">
          <tr>
            <th class="px-6 py-4 font-medium">ID</th>
            <th class="px-6 py-4 font-medium">邮箱</th>
            <th class="px-6 py-4 font-medium">角色</th>
            <th class="px-6 py-4 font-medium">状态</th>
            <th class="px-6 py-4 font-medium">注册时间</th>
            <th class="px-6 py-4 font-medium">操作</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr v-for="user in admin.users" :key="user.id" class="border-t border-ink/5 hover:bg-canvas/50">
            <td class="px-6 py-4 text-ink-muted">#{{ user.id }}</td>
            <td class="px-6 py-4 text-ink">{{ user.email }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded-full text-xs" :class="user.role === 'admin' ? 'bg-terracotta/10 text-terracotta' : 'bg-sage/20 text-ink'">
                {{ user.role === 'admin' ? '管理员' : '会员' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded-full text-xs" :class="user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ user.is_active ? '正常' : '已禁用' }}
              </span>
            </td>
            <td class="px-6 py-4 text-ink-muted">{{ new Date(user.created_at).toLocaleDateString() }}</td>
            <td class="px-6 py-4">
              <button
                @click="toggleStatus(user)"
                class="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors"
                :class="user.is_active ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'"
              >
                <component :is="user.is_active ? Ban : CheckCircle" class="w-3 h-3" />
                {{ user.is_active ? '禁用' : '启用' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!admin.users.length" class="text-center py-12 text-ink-muted">暂无会员数据</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('member@fmt.com')
const password = ref('member123')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    const redirect = route.query.redirect || (auth.isAdmin ? '/admin' : '/member')
    router.push(redirect)
  } catch (e) {
    error.value = '登录失败，请检查邮箱和密码'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-canvas flex items-center justify-center px-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-ink mb-2">欢迎回来</h1>
        <p class="text-ink-muted">登录 FMT 微生态会员账号</p>
      </div>

      <form @submit.prevent="submit" class="bg-cream rounded-[28px] p-8 border border-ink/5">
        <div class="mb-5">
          <label class="block text-sm font-medium text-ink mb-2">邮箱</label>
          <input
            v-model="email"
            type="email"
            class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none transition-colors"
            placeholder="your@email.com"
          />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-ink mb-2">密码</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="mb-4 text-sm text-red-500">{{ error }}</div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3.5 bg-ink text-canvas rounded-2xl font-medium hover:bg-terracotta transition-colors duration-300 disabled:opacity-50"
        >
          {{ loading ? '登录中…' : '登录' }}
        </button>

        <div class="mt-6 text-center text-sm text-ink-muted">
          还没有账号？
          <router-link to="/register" class="text-terracotta hover:underline">立即注册</router-link>
        </div>

        <div class="mt-6 pt-6 border-t border-ink/5 text-xs text-ink-muted space-y-1">
          <p>测试账号（会员）：member@fmt.com / member123</p>
          <p>测试账号（管理员）：admin@fmt.com / admin123</p>
        </div>
      </form>
    </div>
  </div>
</template>

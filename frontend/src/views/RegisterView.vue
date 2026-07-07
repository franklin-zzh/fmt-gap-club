<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const confirm = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  if (password.value !== confirm.value) {
    error.value = '两次输入的密码不一致'
    return
  }
  loading.value = true
  try {
    await auth.register(email.value, password.value)
    router.push('/member')
  } catch (e) {
    error.value = '注册失败，邮箱可能已被使用'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-canvas flex items-center justify-center px-6">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-ink mb-2">加入会员</h1>
        <p class="text-ink-muted">开启你的专属营养方案之旅</p>
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
        <div class="mb-5">
          <label class="block text-sm font-medium text-ink mb-2">密码</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none transition-colors"
            placeholder="••••••••"
          />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-ink mb-2">确认密码</label>
          <input
            v-model="confirm"
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
          {{ loading ? '注册中…' : '立即注册' }}
        </button>

        <div class="mt-6 text-center text-sm text-ink-muted">
          已有账号？
          <router-link to="/login" class="text-terracotta hover:underline">直接登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

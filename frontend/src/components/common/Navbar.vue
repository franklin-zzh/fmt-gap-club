<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Menu, X } from '@lucide/vue'

const router = useRouter()
const auth = useAuthStore()
const scrolled = ref(false)
const mobileOpen = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

function goToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  mobileOpen.value = false
}

function goToLogin() {
  router.push('/login')
}

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-editorial',
      scrolled ? 'bg-canvas/90 backdrop-blur-md shadow-[0_1px_0_0_rgba(44,44,44,0.06)] py-3' : 'bg-transparent py-5'
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <a href="/" class="text-xl font-bold tracking-tight text-ink">FMT 微生态</a>

      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-ink/80">
        <button @click="goToSection('products')" class="hover:text-terracotta transition-colors duration-300">产品</button>
        <button @click="goToSection('tech')" class="hover:text-terracotta transition-colors duration-300">技术</button>
        <button @click="goToSection('knowledge')" class="hover:text-terracotta transition-colors duration-300">知识库</button>
        <button @click="goToSection('testimonials')" class="hover:text-terracotta transition-colors duration-300">案例</button>
      </nav>

      <div class="hidden md:flex items-center gap-4">
        <template v-if="auth.isAuthenticated">
          <button
            @click="router.push(auth.isAdmin ? '/admin' : '/member')"
            class="text-sm font-medium text-ink/80 hover:text-ink transition-colors"
          >
            {{ auth.isAdmin ? '管理后台' : '我的工作台' }}
          </button>
          <button @click="logout" class="text-sm font-medium text-ink/60 hover:text-ink">退出</button>
        </template>
        <button
          v-else
          @click="goToLogin"
          class="px-5 py-2.5 bg-ink text-canvas text-sm font-medium rounded-2xl hover:bg-terracotta transition-colors duration-300"
        >
          加入会员
        </button>
      </div>

      <button class="md:hidden p-2" @click="mobileOpen = !mobileOpen">
        <component :is="mobileOpen ? X : Menu" class="w-6 h-6 text-ink" />
      </button>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="mobileOpen"
      class="md:hidden absolute top-full left-0 right-0 bg-canvas border-b border-ink/5 px-6 py-4 flex flex-col gap-4"
    >
      <button @click="goToSection('products')" class="text-left text-ink/80">产品</button>
      <button @click="goToSection('tech')" class="text-left text-ink/80">技术</button>
      <button @click="goToSection('knowledge')" class="text-left text-ink/80">知识库</button>
      <button @click="goToSection('testimonials')" class="text-left text-ink/80">案例</button>
      <button
        @click="goToLogin"
        class="w-full py-3 bg-ink text-canvas rounded-2xl font-medium"
      >
        加入会员
      </button>
    </div>
  </header>
</template>

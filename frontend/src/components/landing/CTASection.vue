<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <section id="join" class="py-24 md:py-32 bg-cream relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-sage/20 via-canvas to-sand/30" />
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-terracotta/10 blur-3xl" />

    <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
      <p class="text-sm font-medium tracking-[0.2em] text-terracotta uppercase mb-4">Join Membership</p>
      <h2 class="text-4xl md:text-5xl font-bold text-ink mb-6">
        加入会员 · 获取专属营养方案
      </h2>
      <p class="text-lg text-ink-muted mb-10 max-w-xl mx-auto">
        填写健康档案，提交个人需求，让 AI 匹配模型为你推荐最适合的 1-3 款营养包。
      </p>
      <button
        @click="router.push('/register')"
        class="px-10 py-4 bg-ink text-canvas rounded-2xl font-medium text-lg hover:bg-terracotta transition-all duration-300 hover:-translate-y-0.5"
      >
        立即加入会员
      </button>
    </div>
  </section>
</template>

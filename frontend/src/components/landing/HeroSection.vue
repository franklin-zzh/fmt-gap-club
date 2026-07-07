<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function scrollToProducts() {
  const el = document.getElementById('products')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="relative min-h-screen flex items-center overflow-hidden">
    <!-- Gradient background -->
    <div class="absolute inset-0 bg-gradient-to-br from-sage/40 via-canvas to-sand/50" />
    
    <!-- Organic blob shapes -->
    <div class="absolute top-20 right-[-10%] w-[50vw] h-[50vw] rounded-full bg-sage/20 blur-3xl" />
    <div class="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-terracotta/15 blur-3xl" />
    <div class="absolute top-1/2 left-1/3 w-[30vw] h-[30vw] rounded-full bg-sand/30 blur-2xl" />

    <div class="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
      <div class="max-w-3xl">
        <p class="text-sm font-medium tracking-[0.2em] text-ink-muted uppercase mb-6">
          Precision Nutrition · Science-Driven
        </p>
        <h1 class="text-5xl md:text-7xl font-bold leading-[1.1] text-ink mb-6">
          精准营养<br />
          <span class="font-serif-en italic font-normal text-terracotta">·</span> 科学驱动
        </h1>
        <p class="text-lg md:text-xl text-ink-muted leading-relaxed mb-10 max-w-2xl">
          基于自研知识库与 AI 个性化匹配模型，为不同人群定制专属营养方案。让每一次补充，都有据可依。
        </p>
        <div class="flex flex-wrap gap-4">
          <button
            @click="scrollToProducts"
            class="px-8 py-4 bg-ink text-canvas rounded-2xl font-medium hover:bg-terracotta transition-all duration-300 hover:-translate-y-0.5"
          >
            立即了解
          </button>
          <button
            @click="router.push('/login')"
            class="px-8 py-4 border border-ink/20 text-ink rounded-2xl font-medium hover:border-terracotta hover:text-terracotta transition-all duration-300"
          >
            成为会员
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

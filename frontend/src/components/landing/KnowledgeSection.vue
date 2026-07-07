<script setup>
import { ref, onMounted } from 'vue'
import { fetchArticles } from '@/api/public'
import { ArrowRight } from '@lucide/vue'

const articles = ref([])

onMounted(async () => {
  articles.value = await fetchArticles()
})
</script>

<template>
  <section id="knowledge" class="py-24 md:py-32 bg-cream">
    <div class="max-w-7xl mx-auto px-6">
      <div class="md:flex md:items-end md:justify-between mb-12">
        <div>
          <p class="text-sm font-medium tracking-[0.2em] text-terracotta uppercase mb-3">Knowledge Base</p>
          <h2 class="text-3xl md:text-4xl font-bold text-ink">知识库与科研文献</h2>
        </div>
        <p class="text-ink-muted max-w-md mt-4 md:mt-0">
          从科普解读到前沿论文，构建可验证的营养科学内容体系。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="article in articles"
          :key="article.id"
          class="group bg-canvas rounded-[28px] p-8 border border-ink/5 hover:border-terracotta/30 transition-all duration-300 cursor-pointer"
        >
          <div class="flex items-start justify-between mb-4">
            <span class="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-sage/20 text-ink-muted">
              {{ article.category === 'research' ? '科研文献' : '知识库' }}
            </span>
            <ArrowRight class="w-5 h-5 text-ink/30 group-hover:text-terracotta group-hover:translate-x-1 transition-all duration-300" />
          </div>
          <h3 class="text-xl font-bold text-ink mb-3 group-hover:text-terracotta transition-colors duration-300">
            {{ article.title }}
          </h3>
          <p class="text-sm leading-relaxed text-ink-muted line-clamp-2">{{ article.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

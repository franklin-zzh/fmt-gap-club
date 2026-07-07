<script setup>
import { BookOpen, Brain, SlidersHorizontal, FileText } from '@lucide/vue'

const techs = [
  {
    icon: BookOpen,
    title: '自研知识库',
    subtitle: 'Knowledge Base',
    desc: '整合微生态、营养基因组学与临床循证数据，持续迭代标签体系与禁忌规则。',
  },
  {
    icon: Brain,
    title: 'AI 匹配模型',
    subtitle: 'AI Matching Engine',
    desc: '融合健康档案、生活方式与问卷信号，计算产品与个体的多维契合度。',
  },
  {
    icon: SlidersHorizontal,
    title: '个性化算法',
    subtitle: 'Personalization',
    desc: '基于人群细分与目标优先级，动态调整推荐权重，避免千篇一律。',
  },
  {
    icon: FileText,
    title: '科研文献',
    subtitle: 'Publications',
    desc: '每项核心成分均关联高质量研究，确保推荐逻辑可追溯、可验证。',
  },
]
</script>

<template>
  <section id="tech" class="py-24 md:py-32 bg-cream relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[35vw] h-[35vw] rounded-full bg-sage/15 blur-3xl" />
    <div class="absolute bottom-0 left-0 w-[30vw] h-[30vw] rounded-full bg-terracotta/10 blur-3xl" />

    <div class="relative z-10 max-w-7xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <p class="text-sm font-medium tracking-[0.2em] text-terracotta uppercase mb-3">Technology</p>
        <h2 class="text-3xl md:text-4xl font-bold text-ink mb-4">技术介绍</h2>
        <p class="text-ink-muted">四大技术支柱，构建从数据到方案的完整信任链路。</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="tech in techs"
          :key="tech.title"
          class="group bg-canvas rounded-[28px] p-8 border border-ink/5 hover:border-terracotta/30 transition-all duration-300 hover:-translate-y-1"
        >
          <div class="w-12 h-12 rounded-2xl bg-sage/20 flex items-center justify-center mb-6 group-hover:bg-terracotta/20 transition-colors duration-300">
            <component :is="tech.icon" class="w-6 h-6 text-ink group-hover:text-terracotta transition-colors duration-300" />
          </div>
          <p class="text-xs font-medium tracking-wider text-ink-muted uppercase mb-1">{{ tech.subtitle }}</p>
          <h3 class="text-xl font-bold text-ink mb-3">{{ tech.title }}</h3>
          <p class="text-sm leading-relaxed text-ink-muted">{{ tech.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

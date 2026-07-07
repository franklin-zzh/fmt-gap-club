<script setup>
import { onMounted } from 'vue'
import { useMemberStore } from '@/stores/member'
import { FileBarChart, TrendingUp, Award } from '@lucide/vue'

const member = useMemberStore()
onMounted(() => member.loadSubmissions())
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-ink mb-2">分析报告</h1>
      <p class="text-ink-muted">查看 AI 模型为你生成的营养包匹配结果与解读。</p>
    </header>

    <div v-if="!member.submissions.length" class="bg-cream rounded-[28px] p-10 border border-ink/5 text-center text-ink-muted">
      <FileBarChart class="w-12 h-12 mx-auto mb-4 text-ink/20" />
      <p>暂无报告，请先提交定制需求。</p>
    </div>

    <div v-else class="space-y-8">
      <div
        v-for="s in member.submissions"
        :key="s.id"
        class="bg-cream rounded-[28px] p-8 border border-ink/5"
      >
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-ink">专属营养方案 #{{ s.id }}</h2>
            <p class="text-sm text-ink-muted mt-1">生成于 {{ new Date(s.created_at).toLocaleDateString() }}</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-sage/20 text-ink">{{ s.status === 'completed' ? '已完成' : '处理中' }}</span>
        </div>

        <div class="bg-canvas rounded-2xl p-6 mb-6">
          <h3 class="font-semibold text-ink mb-2 flex items-center gap-2">
            <TrendingUp class="w-4 h-4 text-terracotta" /> 分析摘要
          </h3>
          <p class="text-sm text-ink-muted leading-relaxed">{{ s.summary }}</p>
        </div>

        <h3 class="font-semibold text-ink mb-4 flex items-center gap-2">
          <Award class="w-4 h-4 text-terracotta" /> 推荐营养包
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(rec, idx) in s.recommendations"
            :key="rec.product_id"
            :class="[
              'rounded-2xl p-6 border transition-all duration-300',
              idx === 0 ? 'bg-ink text-canvas border-ink' : 'bg-canvas text-ink border-ink/5'
            ]"
          >
            <div class="flex items-center justify-between mb-3">
              <span :class="['text-xs font-bold', idx === 0 ? 'text-terracotta' : 'text-ink-muted']">TOP {{ idx + 1 }}</span>
              <span :class="['text-xs', idx === 0 ? 'text-canvas/70' : 'text-ink-muted']">匹配度 {{ rec.score * 10 }}%</span>
            </div>
            <h4 :class="['font-bold mb-2', idx === 0 ? 'text-canvas' : 'text-ink']">{{ rec.name }}</h4>
            <p :class="['text-xs leading-relaxed mb-3', idx === 0 ? 'text-canvas/80' : 'text-ink-muted']">{{ rec.subtitle }}</p>
            <p :class="['text-xs leading-relaxed', idx === 0 ? 'text-canvas/70' : 'text-ink-muted']">{{ rec.reason }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

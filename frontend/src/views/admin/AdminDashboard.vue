<script setup>
import { onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { Users, Eye, ShoppingBag, TrendingUp } from '@lucide/vue'

const admin = useAdminStore()
onMounted(() => admin.loadStats())

const cards = computed(() => [
  { label: '访客量', value: admin.stats?.total_visitors || 0, icon: Eye },
  { label: '注册会员', value: admin.stats?.total_members || 0, icon: Users },
  { label: '付费会员', value: admin.stats?.paid_members || 0, icon: ShoppingBag },
  { label: '转化率', value: `${admin.stats?.conversion_rate || 0}%`, icon: TrendingUp },
])
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-ink mb-2">数据仪表盘</h1>
      <p class="text-ink-muted">实时监控品牌落地页转化与会员运营数据。</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="card in cards"
        :key="card.label"
        class="bg-cream rounded-[28px] p-6 border border-ink/5"
      >
        <div class="flex items-center justify-between mb-4">
          <component :is="card.icon" class="w-6 h-6 text-terracotta" />
        </div>
        <p class="text-3xl font-bold text-ink">{{ card.value }}</p>
        <p class="text-sm text-ink-muted mt-1">{{ card.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-cream rounded-[28px] p-8 border border-ink/5">
        <h2 class="text-xl font-bold text-ink mb-6">转化漏斗</h2>
        <div class="space-y-6">
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-ink-muted">访客 → 注册</span>
              <span class="font-medium text-ink">{{ admin.stats ? Math.round(admin.stats.total_members / admin.stats.total_visitors * 100) : 0 }}%</span>
            </div>
            <div class="h-2 bg-canvas rounded-full overflow-hidden">
              <div class="h-full bg-sage rounded-full" :style="{ width: admin.stats ? Math.round(admin.stats.total_members / admin.stats.total_visitors * 100) + '%' : '0%' }" />
            </div>
          </div>
          <div>
            <div class="flex justify-between text-sm mb-2">
              <span class="text-ink-muted">注册 → 付费</span>
              <span class="font-medium text-ink">{{ admin.stats ? Math.round(admin.stats.paid_members / admin.stats.total_members * 100) : 0 }}%</span>
            </div>
            <div class="h-2 bg-canvas rounded-full overflow-hidden">
              <div class="h-full bg-terracotta rounded-full" :style="{ width: admin.stats ? Math.round(admin.stats.paid_members / admin.stats.total_members * 100) + '%' : '0%' }" />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-cream rounded-[28px] p-8 border border-ink/5">
        <h2 class="text-xl font-bold text-ink mb-6">收入概览</h2>
        <div class="flex items-baseline gap-2 mb-4">
          <span class="text-4xl font-bold text-ink">¥{{ admin.stats?.revenue?.toLocaleString() || 0 }}</span>
          <span class="text-sm text-ink-muted">累计预估收入</span>
        </div>
        <p class="text-sm text-ink-muted">数据基于当前付费会员与平均客单价计算，MVP 阶段为模拟数据。</p>
      </div>
    </div>
  </div>
</template>

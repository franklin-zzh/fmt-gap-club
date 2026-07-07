<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMemberStore } from '@/stores/member'
import { CreditCard, Check, Crown } from '@lucide/vue'

const member = useMemberStore()
const selectedPlan = ref('')
const processing = ref(false)
const success = ref(false)

const plans = [
  { key: 'monthly', name: '月付会员', price: '¥99', unit: '/月', desc: '按月灵活订阅，随时可取消', featured: false },
  { key: 'quarterly', name: '季付会员', price: '¥249', unit: '/季', desc: '节省 16%，适合短期体验', featured: true },
  { key: 'yearly', name: '年付会员', price: '¥799', unit: '/年', desc: '节省 33%，享全年无限次报告', featured: false },
]

const currentPlan = computed(() => plans.find(p => p.key === member.subscription?.plan_type) || null)

onMounted(() => member.loadSubscription())

async function renew(plan) {
  selectedPlan.value = plan.key
  processing.value = true
  success.value = false
  try {
    await member.renew(plan.key)
    success.value = true
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <div>
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-ink mb-2">订阅管理</h1>
      <p class="text-ink-muted">查看当前套餐、续费或升级会员权益。</p>
    </header>

    <div v-if="member.subscription" class="bg-cream rounded-[28px] p-8 border border-ink/5 mb-8">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm text-ink-muted mb-1">当前套餐</p>
          <h2 class="text-2xl font-bold text-ink flex items-center gap-2">
            <Crown class="w-6 h-6 text-terracotta" />
            {{ currentPlan?.name || '会员' }}
          </h2>
          <p class="text-sm text-ink-muted mt-2">状态：{{ member.subscription.status === 'active' ? '生效中' : '已过期' }}</p>
          <p class="text-sm text-ink-muted">到期日：{{ member.subscription.expired_at ? new Date(member.subscription.expired_at).toLocaleDateString() : '永久' }}</p>
        </div>
        <span class="px-4 py-2 rounded-full text-sm font-medium bg-sage/20 text-ink">{{ member.subscription.status === 'active' ? '生效中' : '已过期' }}</span>
      </div>
    </div>

    <h2 class="text-xl font-bold text-ink mb-6">续费 / 升级</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="plan in plans"
        :key="plan.key"
        :class="[
          'relative rounded-[28px] p-8 border transition-all duration-300',
          plan.featured
            ? 'bg-ink text-canvas border-ink scale-[1.02]'
            : 'bg-cream text-ink border-ink/5 hover:border-terracotta/30'
        ]"
      >
        <div v-if="plan.featured" class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-terracotta text-canvas text-[10px] font-bold uppercase tracking-wider rounded-full">
          最受欢迎
        </div>
        <h3 :class="['text-lg font-bold mb-2', plan.featured ? 'text-canvas' : 'text-ink']">{{ plan.name }}</h3>
        <div class="flex items-baseline gap-1 mb-4">
          <span :class="['text-3xl font-bold', plan.featured ? 'text-canvas' : 'text-ink']">{{ plan.price }}</span>
          <span :class="['text-sm', plan.featured ? 'text-canvas/70' : 'text-ink-muted']">{{ plan.unit }}</span>
        </div>
        <p :class="['text-sm mb-6', plan.featured ? 'text-canvas/80' : 'text-ink-muted']">{{ plan.desc }}</p>
        <ul class="space-y-3 mb-8">
          <li :class="['flex items-center gap-2 text-sm', plan.featured ? 'text-canvas/80' : 'text-ink-muted']">
            <Check class="w-4 h-4" /> 无限次 AI 匹配
          </li>
          <li :class="['flex items-center gap-2 text-sm', plan.featured ? 'text-canvas/80' : 'text-ink-muted']">
            <Check class="w-4 h-4" /> 专属营养报告
          </li>
          <li :class="['flex items-center gap-2 text-sm', plan.featured ? 'text-canvas/80' : 'text-ink-muted']">
            <Check class="w-4 h-4" /> 专家咨询服务
          </li>
        </ul>
        <button
          @click="renew(plan)"
          :disabled="processing && selectedPlan === plan.key"
          :class="[
            'w-full py-3 rounded-2xl font-medium transition-colors duration-300 disabled:opacity-50',
            plan.featured
              ? 'bg-canvas text-ink hover:bg-sand'
              : 'bg-ink text-canvas hover:bg-terracotta'
          ]"
        >
          {{ processing && selectedPlan === plan.key ? '处理中…' : '选择此套餐' }}
        </button>
      </div>
    </div>

    <div v-if="success" class="mt-6 p-4 bg-sage/20 text-ink rounded-2xl text-sm flex items-center gap-2">
      <CreditCard class="w-4 h-4" /> 订阅已更新（MVP 阶段为模拟支付，仅更新界面状态）
    </div>
  </div>
</template>

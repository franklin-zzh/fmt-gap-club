<script setup>
import { onMounted, computed } from 'vue'
import { useMemberStore } from '@/stores/member'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { UserCircle, ClipboardList, FileBarChart, CreditCard, ArrowRight } from '@lucide/vue'

const router = useRouter()
const member = useMemberStore()
const auth = useAuthStore()

const profileCompletion = computed(() => {
  const p = member.profile
  if (!p) return 0
  let score = 0
  if (p.gender) score += 20
  if (p.age) score += 20
  if (p.health_goals?.length) score += 20
  if (p.lifestyle_tags?.length) score += 20
  if (p.allergies !== undefined) score += 20
  return score
})

const latestSubmission = computed(() => member.submissions[0] || null)

onMounted(() => {
  member.loadProfile()
  member.loadSubmissions()
  member.loadSubscription()
})
</script>

<template>
  <div>
    <header class="mb-10">
      <h1 class="text-3xl font-bold text-ink mb-2">你好，{{ auth.user?.email?.split('@')[0] || '会员' }}</h1>
      <p class="text-ink-muted">欢迎来到你的个性化营养工作台</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="bg-cream rounded-[28px] p-6 border border-ink/5">
        <div class="flex items-center justify-between mb-4">
          <UserCircle class="w-6 h-6 text-terracotta" />
          <span class="text-2xl font-bold text-ink">{{ profileCompletion }}%</span>
        </div>
        <p class="text-sm text-ink-muted">档案完成度</p>
      </div>
      <div class="bg-cream rounded-[28px] p-6 border border-ink/5">
        <div class="flex items-center justify-between mb-4">
          <ClipboardList class="w-6 h-6 text-sage" />
          <span class="text-2xl font-bold text-ink">{{ member.submissions.length }}</span>
        </div>
        <p class="text-sm text-ink-muted">定制需求</p>
      </div>
      <div class="bg-cream rounded-[28px] p-6 border border-ink/5">
        <div class="flex items-center justify-between mb-4">
          <FileBarChart class="w-6 h-6 text-terracotta" />
          <span class="text-2xl font-bold text-ink">{{ member.submissions.length }}</span>
        </div>
        <p class="text-sm text-ink-muted">分析报告</p>
      </div>
      <div class="bg-cream rounded-[28px] p-6 border border-ink/5">
        <div class="flex items-center justify-between mb-4">
          <CreditCard class="w-6 h-6 text-sage" />
          <span class="text-sm font-bold px-2 py-1 rounded-full bg-sage/20 text-ink">{{ member.subscription?.plan_type === 'yearly' ? '年付' : member.subscription?.plan_type === 'quarterly' ? '季付' : '月付' }}</span>
        </div>
        <p class="text-sm text-ink-muted">当前订阅</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-cream rounded-[28px] p-8 border border-ink/5">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-ink">最新推荐</h2>
          <button @click="router.push({ name: 'member-reports' })" class="text-sm text-terracotta flex items-center gap-1 hover:underline">
            查看全部 <ArrowRight class="w-4 h-4" />
          </button>
        </div>
        <div v-if="latestSubmission" class="space-y-4">
          <p class="text-sm text-ink-muted">{{ latestSubmission.summary }}</p>
          <div class="space-y-3">
            <div
              v-for="rec in latestSubmission.recommendations"
              :key="rec.product_id"
              class="flex items-center justify-between p-4 bg-canvas rounded-2xl"
            >
              <div>
                <p class="font-semibold text-ink">{{ rec.name }}</p>
                <p class="text-xs text-ink-muted">{{ rec.subtitle }}</p>
              </div>
              <span class="text-xs px-2 py-1 rounded-full bg-terracotta/10 text-terracotta">匹配度 {{ rec.score * 10 }}%</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-10 text-ink-muted">
          暂无推荐，请先提交定制需求
          <div class="mt-4">
            <button @click="router.push({ name: 'member-submission' })" class="px-5 py-2 bg-ink text-canvas rounded-xl text-sm hover:bg-terracotta transition-colors">
              提交需求
            </button>
          </div>
        </div>
      </div>

      <div class="bg-cream rounded-[28px] p-8 border border-ink/5">
        <h2 class="text-xl font-bold text-ink mb-6">快速入口</h2>
        <div class="space-y-3">
          <button
            @click="router.push({ name: 'member-profile' })"
            class="w-full flex items-center justify-between p-4 bg-canvas rounded-2xl hover:bg-sage/10 transition-colors text-left"
          >
            <span class="font-medium text-ink">完善健康档案</span>
            <ArrowRight class="w-4 h-4 text-ink-muted" />
          </button>
          <button
            @click="router.push({ name: 'member-submission' })"
            class="w-full flex items-center justify-between p-4 bg-canvas rounded-2xl hover:bg-sage/10 transition-colors text-left"
          >
            <span class="font-medium text-ink">提交定制需求</span>
            <ArrowRight class="w-4 h-4 text-ink-muted" />
          </button>
          <button
            @click="router.push({ name: 'member-subscription' })"
            class="w-full flex items-center justify-between p-4 bg-canvas rounded-2xl hover:bg-sage/10 transition-colors text-left"
          >
            <span class="font-medium text-ink">管理订阅</span>
            <ArrowRight class="w-4 h-4 text-ink-muted" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

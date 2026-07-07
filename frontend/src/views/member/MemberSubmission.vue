<script setup>
import { ref, onMounted } from 'vue'
import { useMemberStore } from '@/stores/member'
import { useRouter } from 'vue-router'
import { Upload, Send, CheckCircle } from '@lucide/vue'

const router = useRouter()
const member = useMemberStore()

const answers = ref({
  goals: [],
  concerns: [],
  lifestyle: [],
  diet: '',
  notes: '',
})
const file = ref(null)
const submitting = ref(false)
const submitted = ref(false)

const goalOptions = ['改善肠道', '提升免疫', '改善睡眠', '增强精力', '抗衰老', '控制体重', '孕期/哺乳', '儿童成长', '关节养护', '运动恢复']
const concernOptions = ['腹胀/便秘', '易感冒', '失眠多梦', '疲劳乏力', '皮肤状态差', '体重难控', '情绪波动', '记忆力下降']
const lifestyleOptions = ['经常熬夜', '久坐办公', '高频运动', '经常出差', '压力大', '饮食不规律']

onMounted(() => member.loadSubmissions())

function toggleArray(field, value) {
  const arr = answers.value[field]
  const index = arr.indexOf(value)
  if (index === -1) arr.push(value)
  else arr.splice(index, 1)
}

function onFileChange(e) {
  file.value = e.target.files[0]
}

async function submit() {
  submitting.value = true
  const formData = new FormData()
  formData.append('answers', JSON.stringify(answers.value))
  if (file.value) formData.append('file', file.value)
  try {
    await member.submit(formData)
    submitted.value = true
  } finally {
    submitting.value = false
  }
}

function reset() {
  submitted.value = false
  answers.value = { goals: [], concerns: [], lifestyle: [], diet: '', notes: '' }
  file.value = null
}
</script>

<template>
  <div class="max-w-3xl">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-ink mb-2">定制需求提交</h1>
      <p class="text-ink-muted">告诉我们你的健康目标与生活状态，AI 模型将为你匹配最佳营养方案。</p>
    </header>

    <div v-if="submitted" class="bg-cream rounded-[28px] p-10 border border-ink/5 text-center">
      <CheckCircle class="w-16 h-16 text-sage mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-ink mb-2">提交成功</h2>
      <p class="text-ink-muted mb-6">系统已根据你的档案与需求生成推荐，可前往「分析报告」查看。</p>
      <div class="flex justify-center gap-4">
        <button @click="router.push({ name: 'member-reports' })" class="px-6 py-3 bg-ink text-canvas rounded-2xl hover:bg-terracotta transition-colors">查看报告</button>
        <button @click="reset" class="px-6 py-3 border border-ink/10 rounded-2xl hover:border-terracotta hover:text-terracotta transition-colors">继续提交</button>
      </div>
    </div>

    <form v-else @submit.prevent="submit" class="bg-cream rounded-[28px] p-8 border border-ink/5 space-y-8">
      <div>
        <label class="block text-sm font-medium text-ink mb-3">你最想改善的健康目标</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="g in goalOptions"
            :key="g"
            type="button"
            @click="toggleArray('goals', g)"
            :class="['px-4 py-2 rounded-full text-sm border transition-colors', answers.goals.includes(g) ? 'bg-ink text-canvas border-ink' : 'bg-canvas text-ink-muted border-ink/10 hover:border-terracotta']"
          >{{ g }}</button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink mb-3">当前困扰</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="c in concernOptions"
            :key="c"
            type="button"
            @click="toggleArray('concerns', c)"
            :class="['px-4 py-2 rounded-full text-sm border transition-colors', answers.concerns.includes(c) ? 'bg-ink text-canvas border-ink' : 'bg-canvas text-ink-muted border-ink/10 hover:border-terracotta']"
          >{{ c }}</button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink mb-3">生活方式</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="l in lifestyleOptions"
            :key="l"
            type="button"
            @click="toggleArray('lifestyle', l)"
            :class="['px-4 py-2 rounded-full text-sm border transition-colors', answers.lifestyle.includes(l) ? 'bg-ink text-canvas border-ink' : 'bg-canvas text-ink-muted border-ink/10 hover:border-terracotta']"
          >{{ l }}</button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink mb-2">饮食习惯</label>
        <textarea v-model="answers.diet" rows="2" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" placeholder="例如：一日三餐、偏好清淡、偶尔外卖"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink mb-2">补充说明</label>
        <textarea v-model="answers.notes" rows="3" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" placeholder="其他想让我们了解的信息"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink mb-3">上传健康数据（PDF/图片，可选）</label>
        <label class="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-ink/10 bg-canvas cursor-pointer hover:border-terracotta transition-colors">
          <Upload class="w-6 h-6 text-ink-muted mb-2" />
          <span class="text-sm text-ink-muted">{{ file ? file.name : '点击或拖拽文件到此处' }}</span>
          <input type="file" class="hidden" @change="onFileChange" accept=".pdf,.png,.jpg,.jpeg" />
        </label>
      </div>

      <button
        type="submit"
        :disabled="submitting"
        class="w-full py-4 bg-ink text-canvas rounded-2xl font-medium hover:bg-terracotta transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Send class="w-4 h-4" />
        {{ submitting ? '提交中…' : '提交需求' }}
      </button>
    </form>

    <div v-if="member.submissions.length" class="mt-10">
      <h2 class="text-xl font-bold text-ink mb-4">提交历史</h2>
      <div class="space-y-3">
        <div v-for="s in member.submissions" :key="s.id" class="bg-cream rounded-2xl p-5 border border-ink/5 flex items-center justify-between">
          <div>
            <p class="font-medium text-ink">需求 #{{ s.id }}</p>
            <p class="text-xs text-ink-muted mt-1">{{ new Date(s.created_at).toLocaleString() }} · {{ s.status === 'completed' ? '已完成' : '处理中' }}</p>
          </div>
          <span class="text-xs px-2 py-1 rounded-full bg-sage/20 text-ink">{{ s.recommendations.length }} 项推荐</span>
        </div>
      </div>
    </div>
  </div>
</template>

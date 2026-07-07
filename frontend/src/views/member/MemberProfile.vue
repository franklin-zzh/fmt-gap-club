<script setup>
import { ref, onMounted } from 'vue'
import { useMemberStore } from '@/stores/member'
import { Save, Check } from '@lucide/vue'

const member = useMemberStore()
const saving = ref(false)
const saved = ref(false)

const form = ref({
  gender: '',
  age: null,
  height: null,
  weight: null,
  health_goals: [],
  lifestyle_tags: [],
  allergies: '',
  medical_history: '',
})

const goalOptions = ['肠道健康', '免疫力', '睡眠改善', '精力提升', '抗衰老', '体重管理', '孕期营养', '儿童发育', '骨骼关节', '运动恢复']
const lifestyleOptions = ['久坐办公', '经常熬夜', '高频出差', '规律运动', '素食主义', '应酬饮酒', '高强度脑力', '夜班工作']

onMounted(async () => {
  await member.loadProfile()
  if (member.profile) {
    form.value = { ...member.profile }
  }
})

function toggleArray(field, value) {
  const arr = form.value[field]
  const index = arr.indexOf(value)
  if (index === -1) arr.push(value)
  else arr.splice(index, 1)
}

async function submit() {
  saving.value = true
  saved.value = false
  try {
    await member.saveProfile(form.value)
    saved.value = true
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-ink mb-2">健康档案</h1>
      <p class="text-ink-muted">完善档案可帮助 AI 模型更精准地匹配营养方案。</p>
    </header>

    <form @submit.prevent="submit" class="bg-cream rounded-[28px] p-8 border border-ink/5 space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-ink mb-2">性别</label>
          <select v-model="form.gender" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none">
            <option value="">请选择</option>
            <option value="男">男</option>
            <option value="女">女</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-ink mb-2">年龄</label>
          <input v-model.number="form.age" type="number" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink mb-2">身高 (cm)</label>
          <input v-model.number="form.height" type="number" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink mb-2">体重 (kg)</label>
          <input v-model.number="form.weight" type="number" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink mb-3">健康目标（可多选）</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="goal in goalOptions"
            :key="goal"
            type="button"
            @click="toggleArray('health_goals', goal)"
            :class="[
              'px-4 py-2 rounded-full text-sm border transition-colors duration-300',
              form.health_goals.includes(goal)
                ? 'bg-ink text-canvas border-ink'
                : 'bg-canvas text-ink-muted border-ink/10 hover:border-terracotta'
            ]"
          >
            {{ goal }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink mb-3">生活方式标签（可多选）</label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in lifestyleOptions"
            :key="tag"
            type="button"
            @click="toggleArray('lifestyle_tags', tag)"
            :class="[
              'px-4 py-2 rounded-full text-sm border transition-colors duration-300',
              form.lifestyle_tags.includes(tag)
                ? 'bg-ink text-canvas border-ink'
                : 'bg-canvas text-ink-muted border-ink/10 hover:border-terracotta'
            ]"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink mb-2">过敏史 / 饮食禁忌</label>
        <textarea v-model="form.allergies" rows="3" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" placeholder="例如：乳糖不耐受、海鲜过敏等"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-ink mb-2">既往病史 / 用药情况</label>
        <textarea v-model="form.medical_history" rows="3" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" placeholder="简述你的健康状况"></textarea>
      </div>

      <div class="flex items-center gap-4">
        <button
          type="submit"
          :disabled="saving"
          class="px-8 py-3 bg-ink text-canvas rounded-2xl font-medium hover:bg-terracotta transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
        >
          <Save class="w-4 h-4" />
          {{ saving ? '保存中…' : '保存档案' }}
        </button>
        <div v-if="saved" class="flex items-center gap-2 text-sm text-sage font-medium">
          <Check class="w-4 h-4" /> 已保存
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchArticles, createArticle, updateArticle, deleteArticle } from '@/api/admin'
import { Plus, Pencil, Trash2, X } from '@lucide/vue'

const articles = ref([])
const editing = ref(null)
const showForm = ref(false)
const form = ref({
  title: '',
  category: 'knowledge',
  summary: '',
  content: '',
  is_active: true,
})

onMounted(load)

async function load() {
  articles.value = await fetchArticles()
}

function resetForm() {
  form.value = {
    title: '',
    category: 'knowledge',
    summary: '',
    content: '',
    is_active: true,
  }
  editing.value = null
}

function openCreate() {
  resetForm()
  showForm.value = true
}

function openEdit(article) {
  editing.value = article.id
  form.value = { ...article }
  showForm.value = true
}

async function save() {
  if (editing.value) {
    await updateArticle(editing.value, form.value)
  } else {
    await createArticle(form.value)
  }
  showForm.value = false
  resetForm()
  await load()
}

async function remove(article) {
  if (!confirm('确定删除此文章？')) return
  await deleteArticle(article.id)
  await load()
}
</script>

<template>
  <div>
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-ink mb-2">知识库管理</h1>
        <p class="text-ink-muted">维护知识库文章与科研文献。</p>
      </div>
      <button
        @click="openCreate"
        class="px-5 py-2.5 bg-ink text-canvas rounded-2xl font-medium hover:bg-terracotta transition-colors flex items-center gap-2"
      >
        <Plus class="w-4 h-4" /> 新增文章
      </button>
    </header>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div class="bg-cream rounded-[28px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-ink">{{ editing ? '编辑文章' : '新增文章' }}</h2>
          <button @click="showForm = false" class="p-2 hover:bg-ink/5 rounded-full"><X class="w-5 h-5" /></button>
        </div>
        <div class="space-y-4">
          <input v-model="form.title" placeholder="标题" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" />
          <select v-model="form.category" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none">
            <option value="knowledge">知识库</option>
            <option value="research">科研文献</option>
          </select>
          <textarea v-model="form.summary" placeholder="摘要" rows="3" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none"></textarea>
          <textarea v-model="form.content" placeholder="正文内容" rows="6" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none"></textarea>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button @click="showForm = false" class="px-6 py-2.5 border border-ink/10 rounded-2xl hover:border-terracotta hover:text-terracotta transition-colors">取消</button>
          <button @click="save" class="px-6 py-2.5 bg-ink text-canvas rounded-2xl hover:bg-terracotta transition-colors">保存</button>
        </div>
      </div>
    </div>

    <div class="bg-cream rounded-[28px] border border-ink/5 overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-ink text-canvas text-sm">
          <tr>
            <th class="px-6 py-4 font-medium">分类</th>
            <th class="px-6 py-4 font-medium">标题</th>
            <th class="px-6 py-4 font-medium">状态</th>
            <th class="px-6 py-4 font-medium">操作</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr v-for="article in articles" :key="article.id" class="border-t border-ink/5 hover:bg-canvas/50">
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded-full text-xs" :class="article.category === 'research' ? 'bg-terracotta/10 text-terracotta' : 'bg-sage/20 text-ink'">
                {{ article.category === 'research' ? '科研文献' : '知识库' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <p class="font-medium text-ink">{{ article.title }}</p>
              <p class="text-xs text-ink-muted line-clamp-1">{{ article.summary }}</p>
            </td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded-full text-xs" :class="article.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ article.is_active ? '上架' : '下架' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <button @click="openEdit(article)" class="p-2 hover:bg-ink/5 rounded-full text-ink-muted hover:text-terracotta"><Pencil class="w-4 h-4" /></button>
                <button @click="remove(article)" class="p-2 hover:bg-red-50 rounded-full text-ink-muted hover:text-red-500"><Trash2 class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

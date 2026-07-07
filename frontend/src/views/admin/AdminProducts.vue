<script setup>
import { ref, onMounted } from 'vue'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '@/api/admin'
import { Plus, Pencil, Trash2, X } from '@lucide/vue'

const products = ref([])
const editing = ref(null)
const showForm = ref(false)
const form = ref({
  name: '',
  subtitle: '',
  description: '',
  target_group: '',
  tags: '',
  image_url: '',
  order_index: 0,
  is_active: true,
})

onMounted(load)

async function load() {
  products.value = await fetchProducts()
}

function resetForm() {
  form.value = {
    name: '',
    subtitle: '',
    description: '',
    target_group: '',
    tags: '',
    image_url: '',
    order_index: 0,
    is_active: true,
  }
  editing.value = null
}

function openCreate() {
  resetForm()
  showForm.value = true
}

function openEdit(product) {
  editing.value = product.id
  form.value = {
    ...product,
    tags: (product.tags || []).join(', '),
  }
  showForm.value = true
}

async function save() {
  const payload = {
    ...form.value,
    tags: form.value.tags.split(',').map(t => t.trim()).filter(Boolean),
  }
  if (editing.value) {
    await updateProduct(editing.value, payload)
  } else {
    await createProduct(payload)
  }
  showForm.value = false
  resetForm()
  await load()
}

async function remove(product) {
  if (!confirm('确定删除此产品？')) return
  await deleteProduct(product.id)
  await load()
}
</script>

<template>
  <div>
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-ink mb-2">产品管理</h1>
        <p class="text-ink-muted">维护 10 款营养包的产品信息。</p>
      </div>
      <button
        @click="openCreate"
        class="px-5 py-2.5 bg-ink text-canvas rounded-2xl font-medium hover:bg-terracotta transition-colors flex items-center gap-2"
      >
        <Plus class="w-4 h-4" /> 新增产品
      </button>
    </header>

    <!-- Form Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div class="bg-cream rounded-[28px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-ink">{{ editing ? '编辑产品' : '新增产品' }}</h2>
          <button @click="showForm = false" class="p-2 hover:bg-ink/5 rounded-full"><X class="w-5 h-5" /></button>
        </div>
        <div class="space-y-4">
          <input v-model="form.name" placeholder="产品名称" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" />
          <input v-model="form.subtitle" placeholder="副标题" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" />
          <textarea v-model="form.description" placeholder="产品描述" rows="3" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none"></textarea>
          <input v-model="form.target_group" placeholder="适用人群" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" />
          <input v-model="form.tags" placeholder="标签，用逗号分隔" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" />
          <input v-model="form.image_url" placeholder="图片 URL" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" />
          <input v-model.number="form.order_index" type="number" placeholder="排序" class="w-full px-4 py-3 rounded-2xl bg-canvas border border-ink/10 focus:border-terracotta focus:outline-none" />
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
            <th class="px-6 py-4 font-medium">排序</th>
            <th class="px-6 py-4 font-medium">名称</th>
            <th class="px-6 py-4 font-medium">适用人群</th>
            <th class="px-6 py-4 font-medium">状态</th>
            <th class="px-6 py-4 font-medium">操作</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr v-for="product in products" :key="product.id" class="border-t border-ink/5 hover:bg-canvas/50">
            <td class="px-6 py-4 text-ink-muted">{{ product.order_index }}</td>
            <td class="px-6 py-4">
              <p class="font-medium text-ink">{{ product.name }}</p>
              <p class="text-xs text-ink-muted">{{ product.subtitle }}</p>
            </td>
            <td class="px-6 py-4 text-ink-muted">{{ product.target_group }}</td>
            <td class="px-6 py-4">
              <span class="px-2 py-1 rounded-full text-xs" :class="product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                {{ product.is_active ? '上架' : '下架' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex gap-2">
                <button @click="openEdit(product)" class="p-2 hover:bg-ink/5 rounded-full text-ink-muted hover:text-terracotta"><Pencil class="w-4 h-4" /></button>
                <button @click="remove(product)" class="p-2 hover:bg-red-50 rounded-full text-ink-muted hover:text-red-500"><Trash2 class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

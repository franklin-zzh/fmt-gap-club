<script setup>
import { ref, onMounted } from 'vue'
import { fetchProducts } from '@/api/public'
import { ArrowUpRight } from '@lucide/vue'

const products = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    products.value = await fetchProducts()
  } finally {
    loading.value = false
  }
})

const spanClasses = [
  'md:col-span-2 md:row-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
]
</script>

<template>
  <section id="products" class="py-24 md:py-32 bg-canvas">
    <div class="max-w-7xl mx-auto px-6">
      <div class="mb-16 md:flex md:items-end md:justify-between">
        <div>
          <p class="text-sm font-medium tracking-[0.2em] text-terracotta uppercase mb-3">Product Matrix</p>
          <h2 class="text-3xl md:text-4xl font-bold text-ink">10 款精准营养包</h2>
        </div>
        <p class="text-ink-muted max-w-md mt-4 md:mt-0">
          每一款配方均针对特定人群与健康目标设计，从肠道稳态到运动恢复，覆盖全生命周期需求。
        </p>
      </div>

      <div v-if="loading" class="text-center py-20 text-ink-muted">加载中…</div>

      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          v-for="(product, index) in products"
          :key="product.id"
          :class="[
            'group relative bg-cream rounded-[28px] p-6 md:p-8 transition-all duration-300 ease-editorial cursor-pointer overflow-hidden',
            'hover:bg-ink hover:text-canvas',
            spanClasses[index % spanClasses.length]
          ]"
        >
          <div class="relative z-10 h-full flex flex-col justify-between min-h-[220px]">
            <div>
              <div class="flex items-start justify-between mb-6">
                <span class="text-xs font-medium tracking-wider text-ink-muted group-hover:text-canvas/60 uppercase">
                  Formula No. {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span
                  class="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border border-ink/10 text-ink-muted group-hover:border-canvas/20 group-hover:text-canvas/70"
                >
                  {{ product.target_group.split('/')[0] }}
                </span>
              </div>
              <h3 class="text-xl md:text-2xl font-bold mb-2">{{ product.name }}</h3>
              <p class="text-sm text-ink-muted group-hover:text-canvas/70 mb-4">{{ product.subtitle }}</p>
              <p class="text-sm leading-relaxed text-ink/70 group-hover:text-canvas/80 line-clamp-2">
                {{ product.description }}
              </p>
            </div>
            <div class="flex items-center justify-between mt-6">
              <span class="text-xs text-ink-muted group-hover:text-canvas/60">{{ product.target_group }}</span>
              <ArrowUpRight class="w-5 h-5 text-ink/40 group-hover:text-terracotta transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

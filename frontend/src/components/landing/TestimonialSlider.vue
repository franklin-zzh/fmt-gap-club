<script setup>
import { ref, onMounted } from 'vue'
import { fetchComments } from '@/api/public'
import { ChevronLeft, ChevronRight, Quote } from '@lucide/vue'

const comments = ref([])
const slider = ref(null)

onMounted(async () => {
  comments.value = await fetchComments()
})

function scroll(direction) {
  if (!slider.value) return
  const amount = slider.value.clientWidth * 0.8
  slider.value.scrollBy({ left: direction * amount, behavior: 'smooth' })
}
</script>

<template>
  <section id="testimonials" class="py-24 md:py-32 bg-canvas overflow-hidden">
    <div class="max-w-7xl mx-auto px-6">
      <div class="md:flex md:items-end md:justify-between mb-12">
        <div>
          <p class="text-sm font-medium tracking-[0.2em] text-terracotta uppercase mb-3">Testimonials</p>
          <h2 class="text-3xl md:text-4xl font-bold text-ink">用户体验</h2>
        </div>
        <div class="flex gap-3 mt-6 md:mt-0">
          <button
            @click="scroll(-1)"
            class="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center hover:bg-ink hover:text-canvas transition-colors duration-300"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            @click="scroll(1)"
            class="w-12 h-12 rounded-full border border-ink/10 flex items-center justify-center hover:bg-ink hover:text-canvas transition-colors duration-300"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref="slider"
        class="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
        style="scroll-snap-type: x mandatory;"
      >
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="min-w-[85vw] md:min-w-[420px] snap-start bg-cream rounded-[28px] p-8 flex flex-col justify-between"
        >
          <div>
            <Quote class="w-8 h-8 text-terracotta/40 mb-4" />
            <p class="text-lg leading-relaxed text-ink mb-6">{{ comment.content }}</p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-sage/30 flex items-center justify-center text-sm font-bold text-ink">
                {{ comment.user_name[0] }}
              </div>
              <div>
                <p class="font-semibold text-ink text-sm">{{ comment.user_name }}</p>
                <p class="text-xs text-ink-muted">FMT 会员</p>
              </div>
            </div>
            <div v-if="Object.keys(comment.metrics || {}).length" class="text-right">
              <p class="text-xs text-ink-muted">{{ Object.keys(comment.metrics)[0] }}</p>
              <p class="text-sm font-bold text-terracotta">{{ Object.values(comment.metrics)[0] }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

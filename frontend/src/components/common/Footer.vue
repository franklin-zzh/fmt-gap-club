<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-ink text-canvas/90 py-16">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div class="md:col-span-2">
        <h3 class="text-xl font-bold mb-4">FMT 微生态</h3>
        <p class="text-canvas/60 max-w-sm leading-relaxed">
          以精准营养为核心的科技健康品牌。依托自研知识库与 AI 个性化匹配模型，为每一位会员提供科学、可信赖的营养方案。
        </p>
      </div>
      <div>
        <h4 class="font-semibold mb-4 text-canvas">导航</h4>
        <ul class="space-y-2 text-canvas/60 text-sm">
          <li><a href="/#products" class="hover:text-canvas transition-colors">产品</a></li>
          <li><a href="/#tech" class="hover:text-canvas transition-colors">技术</a></li>
          <li><a href="/#knowledge" class="hover:text-canvas transition-colors">知识库</a></li>
          <li><a href="/login" class="hover:text-canvas transition-colors">加入会员</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold mb-4 text-canvas">联系</h4>
        <ul class="space-y-2 text-canvas/60 text-sm">
          <li>contact@fmt-micro.com</li>
          <li>400-888-FMT</li>
          <li>上海市浦东新区</li>
        </ul>
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-canvas/10 text-sm text-canvas/40">
      © {{ year }} FMT 微生态. All rights reserved.
    </div>
  </footer>
</template>

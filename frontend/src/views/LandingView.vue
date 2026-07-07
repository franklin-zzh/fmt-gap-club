<script setup>
import Navbar from '@/components/common/Navbar.vue'
import Footer from '@/components/common/Footer.vue'
import HeroSection from '@/components/landing/HeroSection.vue'
import ProductMatrix from '@/components/landing/ProductMatrix.vue'
import TechSection from '@/components/landing/TechSection.vue'
import KnowledgeSection from '@/components/landing/KnowledgeSection.vue'
import TestimonialSlider from '@/components/landing/TestimonialSlider.vue'
import CTASection from '@/components/landing/CTASection.vue'
</script>

<template>
  <div class="min-h-screen bg-canvas">
    <Navbar />
    <main>
      <HeroSection />
      <ProductMatrix />
      <TechSection />
      <KnowledgeSection />
      <TestimonialSlider />
      <CTASection />
    </main>
    <Footer />
  </div>
</template>

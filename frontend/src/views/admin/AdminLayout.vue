<script setup>
import { onMounted } from 'vue'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
onMounted(() => auth.loadUser())
</script>

<template>
  <div class="min-h-screen bg-canvas flex">
    <AdminSidebar />
    <main class="flex-1 p-6 md:p-10 overflow-auto">
      <router-view />
    </main>
  </div>
</template>

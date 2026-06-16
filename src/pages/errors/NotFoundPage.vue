<script setup>
import { useRouter } from 'vue-router'
import { SearchX } from 'lucide-vue-next'
import AppButton from '@/components/base/AppButton.vue'

const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center px-4">
    <div class="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
      <SearchX class="w-10 h-10 text-gray-400" />
    </div>
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Page not found</h1>
    <p class="text-gray-500 text-sm max-w-xs mb-8">
      The page you are looking for doesn't exist or has been moved.
    </p>
    <AppButton variant="primary" @click="router.push('/dashboard')">
      Back to Dashboard
    </AppButton>
  </div>
</template>

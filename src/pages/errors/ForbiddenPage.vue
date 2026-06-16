<script setup>
import { useRouter } from 'vue-router'
import { ShieldOff } from 'lucide-vue-next'
import AppButton from '@/components/base/AppButton.vue'

const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center px-4">
    <div class="w-20 h-20 rounded-3xl bg-danger-bg flex items-center justify-center mb-6">
      <ShieldOff class="w-10 h-10 text-danger" />
    </div>
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Access denied</h1>
    <p class="text-gray-500 text-sm max-w-xs mb-8">
      You don't have permission to view this page. Contact your administrator if you believe this is an error.
    </p>
    <AppButton variant="primary" @click="router.push('/dashboard')">
      Back to Dashboard
    </AppButton>
  </div>
</template>

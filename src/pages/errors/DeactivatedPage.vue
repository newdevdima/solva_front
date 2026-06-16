<script setup>
import { useRouter } from 'vue-router'
import { UserX } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import AppButton from '@/components/base/AppButton.vue'

const auth = useAuthStore()
const router = useRouter()

function goToLogin() {
  auth.clearSession()
  router.push('/login')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 text-center px-4">
    <div class="w-20 h-20 rounded-3xl bg-warning-bg flex items-center justify-center mb-6">
      <UserX class="w-10 h-10 text-warning" />
    </div>
    <h1 class="text-3xl font-bold text-gray-900 mb-2">Account deactivated</h1>
    <p class="text-gray-500 text-sm max-w-xs mb-8">
      Your account has been deactivated. Please contact your administrator to regain access.
    </p>
    <AppButton variant="primary" @click="goToLogin">
      Back to Login
    </AppButton>
  </div>
</template>

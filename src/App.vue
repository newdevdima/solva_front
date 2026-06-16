<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import ToastContainer from '@/components/base/ToastContainer.vue'
import ConfirmDialog from '@/components/base/ConfirmDialog.vue'

const route = useRoute()

const layout = computed(() => {
  const l = route.meta?.layout
  if (l === 'dashboard') return DashboardLayout
  return AuthLayout
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>

  <!-- Global notification layer -->
  <ToastContainer />
  <ConfirmDialog />
</template>

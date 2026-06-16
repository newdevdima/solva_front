<script setup>
import AppBadge from '@/components/base/AppBadge.vue'
import { LEAD_STATUS } from '@/utils/enums'

defineProps({
  status: { type: String, default: '' },
  dot: { type: Boolean, default: false },
})

const VARIANT_MAP = { success: 'success', danger: 'danger', warning: 'warning', info: 'info', neutral: 'neutral' }
</script>

<template>
  <AppBadge
    :variant="VARIANT_MAP[LEAD_STATUS[status]?.color] ?? 'neutral'"
    :label="LEAD_STATUS[status]?.label ?? status"
    :dot="dot"
  />
</template>

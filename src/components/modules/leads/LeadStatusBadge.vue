<script setup>
import { useI18n } from 'vue-i18n'
import AppBadge from '@/components/base/AppBadge.vue'
import { LEAD_STATUS } from '@/utils/enums'

defineProps({
  status: { type: String, default: '' },
  dot: { type: Boolean, default: false },
})

const { t } = useI18n()
const VARIANT_MAP = { success: 'success', danger: 'danger', warning: 'warning', info: 'info', neutral: 'neutral' }
</script>

<template>
  <AppBadge
    :variant="VARIANT_MAP[LEAD_STATUS[status]?.color] ?? 'neutral'"
    :label="t('statuses.lead.' + status, status)"
    :dot="dot"
  />
</template>

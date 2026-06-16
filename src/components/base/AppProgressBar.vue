<script setup>
defineProps({
  value: { type: Number, default: 0 }, // 0–100
  color: { type: String, default: 'bg-info' },
  height: { type: String, default: 'h-1.5' },
  showLabel: { type: Boolean, default: false },
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div :class="['flex-1 bg-gray-100 rounded-full overflow-hidden', height]">
      <div
        :class="['h-full rounded-full transition-all duration-300', color]"
        :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"
      />
    </div>
    <span v-if="showLabel" class="text-xs text-gray-500 shrink-0 w-8 text-right">
      {{ Math.round(value) }}%
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { initials } from '@/utils/formatters'

const props = defineProps({
  name: { type: String, default: '' },
  src: { type: String, default: '' },
  size: { type: String, default: 'md' }, // xs | sm | md | lg
  alt: { type: String, default: '' },
})

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
}

const avatarInitials = computed(() => initials(props.name))

// Deterministic colour from name
const colors = [
  'bg-indigo-500',
  'bg-violet-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
]
const bgColor = computed(() => {
  if (!props.name) return 'bg-gray-400'
  const idx = props.name.charCodeAt(0) % colors.length
  return colors[idx]
})
</script>

<template>
  <div
    :class="[
      'rounded-full overflow-hidden shrink-0 flex items-center justify-center font-semibold text-white select-none',
      sizeClasses[size],
      src ? '' : bgColor,
    ]"
  >
    <img v-if="src" :src="src" :alt="alt || name" class="w-full h-full object-cover" />
    <span v-else>{{ avatarInitials }}</span>
  </div>
</template>

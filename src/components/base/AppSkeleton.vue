<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '16px' },
  rounded: { type: String, default: 'rounded-md' },
  class: { type: String, default: '' },
})
</script>

<template>
  <div
    :style="{ width, height }"
    :class="['skeleton-shimmer', rounded, $props.class]"
  />
</template>

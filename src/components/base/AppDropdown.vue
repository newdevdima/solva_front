<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  align: { type: String, default: 'left' }, // left | right
  width: { type: String, default: 'w-48' },
})

const open = ref(false)
const root = ref(null)

function toggle() {
  open.value = !open.value
}

function close() {
  open.value = false
}

function handleClickOutside(e) {
  if (root.value && !root.value.contains(e.target)) close()
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

defineExpose({ close })
</script>

<template>
  <div ref="root" class="relative inline-block">
    <!-- Trigger -->
    <div @click="toggle">
      <slot name="trigger" :open="open" />
    </div>

    <!-- Panel -->
    <Transition name="modal">
      <div
        v-if="open"
        :class="[
          'absolute top-full mt-1 z-40 bg-white rounded-xl shadow-dropdown border border-gray-100 py-1',
          width,
          align === 'right' ? 'right-0' : 'left-0',
        ]"
        @click="close"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

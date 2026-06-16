<script setup>
import { InboxIcon } from 'lucide-vue-next'

defineProps({
  title: { type: String, default: 'No results found' },
  description: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  icon: { type: Object, default: () => InboxIcon },
})

const emit = defineEmits(['action'])
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
      <component :is="icon" class="w-8 h-8 text-gray-400" />
    </div>

    <h3 class="text-base font-semibold text-gray-900 mb-1">{{ title }}</h3>

    <p v-if="description" class="text-sm text-gray-500 max-w-xs mb-6">
      {{ description }}
    </p>

    <button
      v-if="actionLabel"
      class="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover
             text-white text-sm font-medium rounded-xl transition-colors"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>

    <!-- Optional slot for custom actions -->
    <slot />
  </div>
</template>

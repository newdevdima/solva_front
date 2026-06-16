<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'md' }, // sm | md | lg | xl
  closable: { type: Boolean, default: true },
})

const emit = defineEmits(['close'])

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

function close() {
  if (props.closable) emit('close')
}

function handleKey(e) {
  if (e.key === 'Escape' && props.open) close()
}

onMounted(() => document.addEventListener('keydown', handleKey))
onUnmounted(() => document.removeEventListener('keydown', handleKey))

// Lock body scroll when modal is open
watch(
  () => props.open,
  (val) => {
    document.body.style.overflow = val ? 'hidden' : ''
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close" />

        <!-- Panel -->
        <Transition name="modal-panel">
          <div
            v-if="open"
            :class="[
              'relative w-full bg-white rounded-2xl shadow-modal flex flex-col max-h-[90vh]',
              sizeClasses[size],
            ]"
            role="dialog"
            :aria-modal="true"
            :aria-label="title"
          >
            <!-- Header -->
            <div
              v-if="title || closable"
              class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0"
            >
              <h2 class="text-base font-semibold text-gray-900">{{ title }}</h2>
              <button
                v-if="closable"
                class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100
                       transition-colors focus:outline-none focus-ring"
                @click="close"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Body -->
            <div class="overflow-y-auto flex-1 px-6 py-5">
              <slot />
            </div>

            <!-- Footer slot -->
            <div
              v-if="$slots.footer"
              class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

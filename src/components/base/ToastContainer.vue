<script setup>
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui.store'

const ui = useUiStore()

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const variantClasses = {
  success: 'border-success/20 bg-success-bg text-success',
  error: 'border-danger/20 bg-danger-bg text-danger',
  warning: 'border-warning/20 bg-warning-bg text-warning',
  info: 'border-info/20 bg-info-bg text-info',
}

const iconClasses = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="assertive"
    >
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
        <div
          v-for="toast in ui.toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg',
            'min-w-[280px] max-w-[360px] bg-white',
            variantClasses[toast.type],
          ]"
          role="alert"
        >
          <!-- Icon -->
          <component
            :is="icons[toast.type]"
            :class="['w-5 h-5 shrink-0 mt-0.5', iconClasses[toast.type]]"
          />

          <!-- Message -->
          <p class="flex-1 text-sm font-medium text-gray-900 leading-snug">
            {{ toast.message }}
          </p>

          <!-- Dismiss -->
          <button
            class="shrink-0 p-0.5 rounded text-gray-400 hover:text-gray-600 transition-colors"
            @click="ui.dismissToast(toast.id)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

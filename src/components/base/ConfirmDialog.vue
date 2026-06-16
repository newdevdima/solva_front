<script setup>
import { AlertTriangle } from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui.store'
import AppButton from './AppButton.vue'

const ui = useUiStore()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="ui.confirmState"
        class="fixed inset-0 z-[90] flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="ui.resolveConfirm(false)"
        />

        <!-- Dialog -->
        <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-modal p-6">
          <div class="flex flex-col items-center text-center gap-4">
            <div class="w-12 h-12 rounded-full bg-danger-bg flex items-center justify-center">
              <AlertTriangle class="w-6 h-6 text-danger" />
            </div>

            <div>
              <h3 class="text-base font-semibold text-gray-900 mb-1">
                {{ ui.confirmState.title }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ ui.confirmState.message }}
              </p>
            </div>

            <div class="flex gap-3 w-full mt-1">
              <AppButton
                variant="ghost"
                class="flex-1"
                @click="ui.resolveConfirm(false)"
              >
                Cancel
              </AppButton>
              <AppButton
                variant="danger"
                class="flex-1"
                @click="ui.resolveConfirm(true)"
              >
                Confirm
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

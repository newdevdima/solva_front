<script setup>
import { useUiStore } from '@/stores/ui.store'
import TheSidebar from './TheSidebar.vue'
import TheTopbar from './TheTopbar.vue'

const ui = useUiStore()
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-page">
    <!-- Mobile backdrop -->
    <Transition name="modal">
      <div
        v-if="ui.sidebarOpen"
        class="fixed inset-0 z-20 bg-black/40 lg:hidden"
        @click="ui.toggleSidebar()"
      />
    </Transition>

    <!-- Sidebar -->
    <TheSidebar />

    <!-- Main area -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <TheTopbar />

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

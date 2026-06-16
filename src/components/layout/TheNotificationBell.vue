<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Bell } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()
const canViewNotifications = computed(() => auth.can('NOTIFICATIONS_VIEW'))

// Stub: real data will come from appointment reminders polling in the module layer
const unreadCount = ref(0)
const open = ref(false)

function toggle() {
  if (!canViewNotifications.value) return
  open.value = !open.value
}

function close() {
  open.value = false
}

// Close on outside click
function handleClickOutside(e) {
  if (!e.target.closest('[data-bell]')) close()
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div
    v-if="canViewNotifications"
    class="relative"
    data-bell
  >
    <button
      class="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      @click="toggle"
    >
      <Bell class="w-5 h-5" />
      <span
        v-if="unreadCount > 0"
        class="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-[10px] font-bold
               rounded-full flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown panel -->
    <Transition name="modal">
      <div
        v-if="open"
        class="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-dropdown border border-gray-100 z-50"
      >
        <div class="p-4 border-b border-gray-100">
          <h3 class="text-sm font-semibold text-gray-900">Notifications</h3>
        </div>
        <div class="p-6 text-center text-sm text-gray-500">
          No pending notifications
        </div>
      </div>
    </Transition>
  </div>
</template>

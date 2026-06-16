import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const toasts = ref([])
  const confirmState = ref(null)
  const sidebarOpen = ref(false)

  let _counter = 0

  /* ── Toasts ────────────────────────────────────────────────── */
  function showToast(type, message, duration = 4000) {
    const id = ++_counter
    toasts.value.push({ id, type, message })
    setTimeout(() => dismissToast(id), duration)
  }

  function dismissToast(id) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx > -1) toasts.value.splice(idx, 1)
  }

  const showSuccess = (msg) => showToast('success', msg)
  const showError = (msg) => showToast('error', msg)
  const showWarning = (msg) => showToast('warning', msg)
  const showInfo = (msg) => showToast('info', msg)

  /* ── Confirm dialog ─────────────────────────────────────────── */
  function confirm(title, message) {
    return new Promise((resolve) => {
      confirmState.value = { title, message, resolve }
    })
  }

  function resolveConfirm(result) {
    confirmState.value?.resolve(result)
    confirmState.value = null
  }

  /* ── Sidebar ────────────────────────────────────────────────── */
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  return {
    toasts,
    confirmState,
    sidebarOpen,
    showToast,
    dismissToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    confirm,
    resolveConfirm,
    toggleSidebar,
  }
})

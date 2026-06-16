import { useUiStore } from '@/stores/ui.store'

export function useToast() {
  const ui = useUiStore()
  return {
    showSuccess: ui.showSuccess,
    showError: ui.showError,
    showWarning: ui.showWarning,
    showInfo: ui.showInfo,
  }
}

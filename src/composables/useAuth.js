import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

/**
 * Exposes auth state and helpers in a composable interface.
 * Keeps components decoupled from the store import.
 */
export function useAuth() {
  const store = useAuthStore()

  const currentUser = computed(() => store.user)
  const isAuthenticated = computed(() => store.isAuthenticated)

  return {
    currentUser,
    isAuthenticated,
    can: store.can,
    hasRole: store.hasRole,
    canAny: store.canAny,
    logout: store.logout,
  }
}

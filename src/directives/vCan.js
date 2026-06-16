import { useAuthStore } from '@/stores/auth.store'

/**
 * v-can="'LEADS_CREATE'"
 * Hides the element (display: none) when the current user lacks the permission.
 * Use v-if="can('...')" when full DOM removal is needed.
 */
export const vCan = {
  mounted(el, binding) {
    applyPermission(el, binding.value)
  },
  updated(el, binding) {
    applyPermission(el, binding.value)
  },
}

function applyPermission(el, permission) {
  const store = useAuthStore()
  const allowed = permission.endsWith('_*')
    ? store.canAny(permission.slice(0, -2))
    : store.can(permission)
  el.style.display = allowed ? '' : 'none'
}

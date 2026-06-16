import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

/**
 * Provides a debounced search input value.
 * @param {Function} onSearch - called with the debounced string
 * @param {number} delay - debounce delay in ms (default 300)
 */
export function useSearch(onSearch, delay = 300) {
  const query = ref('')

  const debouncedSearch = useDebounceFn((val) => {
    onSearch(val)
  }, delay)

  watch(query, (val) => {
    debouncedSearch(val)
  })

  function clear() {
    query.value = ''
    onSearch('')
  }

  return { query, clear }
}

import { ref, computed } from 'vue'

/**
 * Manages pagination state for a list view.
 * @param {object} opts
 * @param {number} opts.defaultPerPage
 */
export function usePagination({ defaultPerPage = 15 } = {}) {
  const currentPage = ref(1)
  const perPage = ref(defaultPerPage)
  const meta = ref(null) // populated from API response meta

  const totalPages = computed(() => meta.value?.last_page ?? 1)
  const total = computed(() => meta.value?.total ?? 0)
  const from = computed(() => meta.value?.from ?? 0)
  const to = computed(() => meta.value?.to ?? 0)

  function setMeta(apiMeta) {
    meta.value = apiMeta
    currentPage.value = apiMeta.current_page
  }

  function goToPage(page) {
    currentPage.value = page
  }

  function setPerPage(val) {
    perPage.value = val
    currentPage.value = 1
  }

  function reset() {
    currentPage.value = 1
    meta.value = null
  }

  return {
    currentPage,
    perPage,
    meta,
    totalPages,
    total,
    from,
    to,
    setMeta,
    goToPage,
    setPerPage,
    reset,
  }
}

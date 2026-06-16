<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Filter, X, UserCircle } from 'lucide-vue-next'
import { useLeadsStore } from '@/stores/leads.store'
import { useLeadSourcesStore } from '@/stores/leadSources.store'
import { useUiStore } from '@/stores/ui.store'
import { useToast } from '@/composables/useToast'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppTable from '@/components/base/AppTable.vue'
import AppPagination from '@/components/base/AppPagination.vue'
import AppSearchInput from '@/components/base/AppSearchInput.vue'
import AppSelect from '@/components/base/AppSelect.vue'
import AppAvatar from '@/components/base/AppAvatar.vue'
import AppBadge from '@/components/base/AppBadge.vue'
import LeadStatusBadge from '@/components/modules/leads/LeadStatusBadge.vue'
import LeadStatusDropdown from '@/components/modules/leads/LeadStatusDropdown.vue'
import { LEAD_STATUS_OPTIONS, INSURANCE_TYPE_OPTIONS } from '@/utils/enums'
import { formatDate } from '@/utils/formatters'

const router = useRouter()
const leadsStore = useLeadsStore()
const sourcesStore = useLeadSourcesStore()
const ui = useUiStore()
const toast = useToast()

const showFilters = ref(false)
const statusChangingId = ref(null)

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'phone', label: 'Phone' },
  { key: 'insurance_type', label: 'Type' },
  { key: 'status', label: 'Status' },
  { key: 'source', label: 'Source' },
  { key: 'assigned_to', label: 'Assigned' },
  { key: 'created_at', label: 'Created', sortable: true },
  { key: 'actions', label: '', align: 'right', width: '100px' },
]

const sourceOptions = computed(() => [
  { value: '', label: 'All Sources' },
  ...sourcesStore.list.map((s) => ({ value: s.id, label: s.name })),
])

const statusOptions = [{ value: '', label: 'All Statuses' }, ...LEAD_STATUS_OPTIONS]
const insuranceOptions = [{ value: '', label: 'All Types' }, ...INSURANCE_TYPE_OPTIONS]

onMounted(() => {
  leadsStore.fetchList()
  sourcesStore.fetchList()
})

function onSort({ key, dir }) {
  leadsStore.filters.sort_by = key
  leadsStore.filters.sort_dir = dir
  leadsStore.fetchList()
}

async function onStatusChange(lead, status) {
  statusChangingId.value = lead.id
  try {
    await leadsStore.updateStatus(lead.id, status)
    toast.showSuccess('Status updated')
  } catch (e) {
    toast.showError(e?.message ?? 'Failed to update status')
  } finally {
    statusChangingId.value = null
  }
}

async function handleDelete(row) {
  const ok = await ui.confirm('Delete Lead', `Delete "${row.name}"? This cannot be undone.`)
  if (!ok) return
  try {
    await leadsStore.remove(row.id)
    toast.showSuccess('Lead deleted')
  } catch (e) {
    toast.showError(e?.message ?? 'Failed to delete lead')
  }
}

const from = computed(() =>
  leadsStore.meta.total === 0
    ? 0
    : (leadsStore.meta.current_page - 1) * leadsStore.meta.per_page + 1,
)
const to = computed(() =>
  Math.min(leadsStore.meta.current_page * leadsStore.meta.per_page, leadsStore.meta.total),
)
</script>

<template>
  <div class="space-y-5">
    <!-- Hero header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover px-6 py-5 shadow-card">
      <!-- decorative circles -->
      <div class="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
      <div class="pointer-events-none absolute -bottom-10 -right-20 w-56 h-56 rounded-full bg-white/5" />
      <div class="relative z-10 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-bold text-white">Leads</h1>
          <p class="text-sm text-indigo-200 mt-0.5">{{ leadsStore.meta.total }} leads in total</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <AppButton variant="secondary" size="sm" @click="showFilters = !showFilters">
            <template #icon><Filter class="w-4 h-4" /></template>
            Filters
            <span
              v-if="leadsStore.activeFiltersCount"
              class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold"
            >{{ leadsStore.activeFiltersCount }}</span>
          </AppButton>
          <AppButton size="sm" class="!bg-white !text-primary hover:!bg-indigo-50" @click="router.push({ name: 'leads.create' })">
            <template #icon><Plus class="w-4 h-4" /></template>
            New Lead
          </AppButton>
        </div>
      </div>
    </div>

    <!-- Search + Filters card -->
    <AppCard padding="sm" class="space-y-3">
      <AppSearchInput
        :model-value="leadsStore.filters.search"
        placeholder="Search name, phone, email…"
        @update:model-value="leadsStore.setFilter('search', $event)"
      />
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="showFilters" class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <AppSelect
            :model-value="leadsStore.filters.status"
            :options="statusOptions"
            placeholder="All Statuses"
            @update:model-value="leadsStore.setFilter('status', $event)"
          />
          <AppSelect
            :model-value="leadsStore.filters.insurance_type"
            :options="insuranceOptions"
            placeholder="All Types"
            @update:model-value="leadsStore.setFilter('insurance_type', $event)"
          />
          <AppSelect
            :model-value="leadsStore.filters.source_id"
            :options="sourceOptions"
            placeholder="All Sources"
            @update:model-value="leadsStore.setFilter('source_id', $event)"
          />
          <div class="flex items-end">
            <AppButton
              v-if="leadsStore.activeFiltersCount"
              variant="ghost"
              size="sm"
              class="w-full"
              @click="leadsStore.resetFilters()"
            >
              <template #icon><X class="w-3.5 h-3.5" /></template>
              Clear
            </AppButton>
          </div>
        </div>
      </Transition>
    </AppCard>

    <!-- Table card -->
    <AppCard padding="none">
      <AppTable
        :columns="COLUMNS"
        :rows="leadsStore.list"
        :loading="leadsStore.loading.list"
        :sort-key="leadsStore.filters.sort_by"
        :sort-dir="leadsStore.filters.sort_dir"
        row-key="id"
        empty-title="No leads found"
        empty-description="Adjust your filters or create a new lead."
        @sort="onSort"
        @row-click="(row) => router.push({ name: 'leads.detail', params: { id: row.id } })"
      >
        <template #cell-name="{ row }">
          <div class="flex items-center gap-2.5">
            <AppAvatar :name="row.name" size="sm" />
            <div class="min-w-0">
              <p class="font-medium text-gray-900 truncate leading-tight">{{ row.name }}</p>
              <p v-if="row.email" class="text-xs text-gray-400 truncate">{{ row.email }}</p>
            </div>
          </div>
        </template>

        <template #cell-insurance_type="{ value }">
          <span class="text-xs font-medium text-gray-600 whitespace-nowrap">
            {{ value?.replace(/_/g, ' ') ?? '—' }}
          </span>
        </template>

        <template #cell-status="{ row }">
          <div @click.stop>
            <LeadStatusDropdown
              :status="row.status"
              :loading="statusChangingId === row.id"
              @change="(s) => onStatusChange(row, s)"
            />
          </div>
        </template>

        <template #cell-source="{ row }">
          <span class="text-sm text-gray-600">{{ row.source?.name ?? '—' }}</span>
        </template>

        <template #cell-assigned_to="{ row }">
          <div v-if="row.assigned_to" class="flex items-center gap-1.5">
            <AppAvatar :name="row.assigned_to.name" size="xs" />
            <span class="text-sm text-gray-700 truncate max-w-[100px]">{{ row.assigned_to.name }}</span>
          </div>
          <div v-else class="flex items-center gap-1 text-gray-400">
            <UserCircle class="w-4 h-4" />
            <span class="text-xs">Unassigned</span>
          </div>
        </template>

        <template #cell-created_at="{ value }">
          <span class="text-sm text-gray-500 whitespace-nowrap">{{ formatDate(value) }}</span>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex items-center justify-end gap-1" @click.stop>
            <AppButton
              variant="ghost"
              size="sm"
              @click="router.push({ name: 'leads.edit', params: { id: row.id } })"
            >
              Edit
            </AppButton>
            <AppButton
              variant="ghost"
              size="sm"
              class="!text-danger hover:!bg-danger-bg"
              @click="handleDelete(row)"
            >
              Delete
            </AppButton>
          </div>
        </template>
      </AppTable>

      <div class="border-t border-gray-100 px-4">
        <AppPagination
          :current-page="leadsStore.meta.current_page"
          :last-page="leadsStore.meta.last_page"
          :total="leadsStore.meta.total"
          :from="from"
          :to="to"
          :per-page="leadsStore.meta.per_page"
          @page-change="leadsStore.setFilter('page', $event)"
          @per-page-change="leadsStore.setFilter('per_page', $event)"
        />
      </div>
    </AppCard>
  </div>
</template>

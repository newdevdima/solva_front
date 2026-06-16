<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Upload, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-vue-next'
import { useLeadImportsStore } from '@/stores/leadImports.store'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppTable from '@/components/base/AppTable.vue'
import AppPagination from '@/components/base/AppPagination.vue'
import AppBadge from '@/components/base/AppBadge.vue'
import { LEAD_IMPORT_STATUS } from '@/utils/enums'
import { formatDateTime } from '@/utils/formatters'

const router = useRouter()
const store = useLeadImportsStore()

const STATUS_ICONS = {
  PENDING: Clock,
  PROCESSING: Clock,
  COMPLETED: CheckCircle,
  FAILED: XCircle,
}

const STATUS_VARIANT = {
  PENDING: 'neutral',
  PROCESSING: 'info',
  COMPLETED: 'success',
  FAILED: 'danger',
}

const COLUMNS = [
  { key: 'filename', label: 'File' },
  { key: 'status', label: 'Status' },
  { key: 'total_rows', label: 'Rows', align: 'right' },
  { key: 'imported_count', label: 'Imported', align: 'right' },
  { key: 'failed_count', label: 'Failed', align: 'right' },
  { key: 'created_at', label: 'Uploaded' },
]

const from = computed(() =>
  store.meta.total === 0 ? 0 : (store.meta.current_page - 1) * store.meta.per_page + 1,
)
const to = computed(() => Math.min(store.meta.current_page * store.meta.per_page, store.meta.total))

onMounted(() => store.fetchList())
</script>

<template>
  <div class="space-y-5">
    <!-- Hero header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover px-6 py-5 shadow-card">
      <div class="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
      <div class="pointer-events-none absolute -bottom-10 -right-20 w-56 h-56 rounded-full bg-white/5" />
      <div class="relative z-10 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-bold text-white">Lead Imports</h1>
          <p class="text-sm text-indigo-200 mt-0.5">{{ store.meta.total }} import jobs</p>
        </div>
        <AppButton size="sm" class="!bg-white !text-primary hover:!bg-indigo-50" @click="router.push({ name: 'lead-imports.create' })">
          <template #icon><Upload class="w-4 h-4" /></template>
          Import CSV
        </AppButton>
      </div>
    </div>

    <AppCard padding="none">
      <AppTable
        :columns="COLUMNS"
        :rows="store.list"
        :loading="store.loading.list"
        row-key="id"
        empty-title="No imports yet"
        empty-description="Upload a CSV file to import leads in bulk."
        @row-click="(row) => store.fetchOne(row.id)"
      >
        <template #cell-filename="{ row }">
          <div class="flex items-center gap-2">
            <Upload class="w-4 h-4 text-gray-400 shrink-0" />
            <span class="text-sm font-medium text-gray-900 truncate">
              {{ row.filename ?? row.original_filename ?? 'import.csv' }}
            </span>
          </div>
        </template>

        <template #cell-status="{ value }">
          <AppBadge
            :variant="STATUS_VARIANT[value] ?? 'neutral'"
            :label="LEAD_IMPORT_STATUS[value]?.label ?? value"
            dot
          />
        </template>

        <template #cell-total_rows="{ value }">
          <span class="text-sm text-gray-700 font-mono">{{ value ?? '—' }}</span>
        </template>

        <template #cell-imported_count="{ value }">
          <span class="text-sm text-success font-mono">{{ value ?? '—' }}</span>
        </template>

        <template #cell-failed_count="{ value }">
          <span :class="['text-sm font-mono', value > 0 ? 'text-danger' : 'text-gray-400']">
            {{ value ?? '—' }}
          </span>
        </template>

        <template #cell-created_at="{ value }">
          <span class="text-sm text-gray-500">{{ formatDateTime(value) }}</span>
        </template>
      </AppTable>

      <div class="border-t border-gray-100 px-4">
        <AppPagination
          :current-page="store.meta.current_page"
          :last-page="store.meta.last_page"
          :total="store.meta.total"
          :from="from"
          :to="to"
          :per-page="store.meta.per_page"
          @page-change="store.setFilter('page', $event)"
        />
      </div>
    </AppCard>
  </div>
</template>

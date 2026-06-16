<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Filter, X } from 'lucide-vue-next'
import { useUsersStore } from '@/stores/users.store'
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
import AppToggle from '@/components/base/AppToggle.vue'
import { ROLE_OPTIONS } from '@/utils/enums'
import { formatDate } from '@/utils/formatters'

const router = useRouter()
const store = useUsersStore()
const ui = useUiStore()
const toast = useToast()

const showFilters = ref(false)

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: false },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'is_active', label: 'Status' },
  { key: 'created_at', label: 'Joined' },
  { key: 'actions', label: '', align: 'right', width: '120px' },
]

const roleOptions = [{ value: '', label: 'All Roles' }, ...ROLE_OPTIONS]
const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: '1', label: 'Active' },
  { value: '0', label: 'Inactive' },
]

const from = computed(() =>
  store.meta.total === 0 ? 0 : (store.meta.current_page - 1) * store.meta.per_page + 1,
)
const to = computed(() => Math.min(store.meta.current_page * store.meta.per_page, store.meta.total))

onMounted(() => store.fetchList())

async function toggleActive(user) {
  try {
    await store.toggleStatus(user.id, !user.is_active)
    toast.showSuccess(user.is_active ? 'User deactivated' : 'User activated')
  } catch (e) {
    toast.showError(e?.message ?? 'Failed to update status')
  }
}

async function handleDelete(user) {
  const ok = await ui.confirm('Delete User', `Delete "${user.name}"? This cannot be undone.`)
  if (!ok) return
  try {
    await store.remove(user.id)
    toast.showSuccess('User deleted')
  } catch (e) {
    toast.showError(e?.message ?? 'Failed to delete user')
  }
}
</script>

<template>
  <div class="space-y-5">
    <!-- Hero header -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover px-6 py-5 shadow-card">
      <div class="pointer-events-none absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
      <div class="pointer-events-none absolute -bottom-10 -right-20 w-56 h-56 rounded-full bg-white/5" />
      <div class="relative z-10 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-2xl font-bold text-white">Users</h1>
          <p class="text-sm text-indigo-200 mt-0.5">{{ store.meta.total }} users in the system</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <AppButton variant="secondary" size="sm" @click="showFilters = !showFilters">
            <template #icon><Filter class="w-4 h-4" /></template>
            Filters
          </AppButton>
          <AppButton size="sm" class="!bg-white !text-primary hover:!bg-indigo-50" @click="router.push({ name: 'users.create' })">
            <template #icon><Plus class="w-4 h-4" /></template>
            New User
          </AppButton>
        </div>
      </div>
    </div>

    <AppCard padding="sm" class="space-y-3">
      <AppSearchInput
        :model-value="store.filters.search"
        placeholder="Search name or email…"
        @update:model-value="store.setFilter('search', $event)"
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
            :model-value="store.filters.role"
            :options="roleOptions"
            placeholder="All Roles"
            @update:model-value="store.setFilter('role', $event)"
          />
          <AppSelect
            :model-value="store.filters.is_active"
            :options="statusOptions"
            placeholder="All Statuses"
            @update:model-value="store.setFilter('is_active', $event)"
          />
          <div class="flex items-end">
            <AppButton
              v-if="store.filters.role || store.filters.is_active"
              variant="ghost"
              size="sm"
              class="w-full"
              @click="store.resetFilters()"
            >
              <template #icon><X class="w-3.5 h-3.5" /></template>
              Clear
            </AppButton>
          </div>
        </div>
      </Transition>
    </AppCard>

    <AppCard padding="none">
      <AppTable
        :columns="COLUMNS"
        :rows="store.list"
        :loading="store.loading.list"
        row-key="id"
        empty-title="No users found"
        empty-description="Invite the first team member."
        @row-click="(row) => router.push({ name: 'users.detail', params: { id: row.id } })"
      >
        <template #cell-name="{ row }">
          <div class="flex items-center gap-2.5">
            <AppAvatar :name="row.name" size="sm" />
            <span class="font-medium text-gray-900 text-sm">{{ row.name }}</span>
          </div>
        </template>

        <template #cell-email="{ value }">
          <span class="text-sm text-gray-500">{{ value }}</span>
        </template>

        <template #cell-role="{ value }">
          <AppBadge
            :variant="value === 'super_admin' ? 'danger' : value === 'manager' ? 'warning' : 'info'"
            :label="value?.replace('_', ' ') ?? '—'"
          />
        </template>

        <template #cell-is_active="{ row }">
          <div @click.stop>
            <AppToggle
              :model-value="row.is_active"
              @update:model-value="() => toggleActive(row)"
            />
          </div>
        </template>

        <template #cell-created_at="{ value }">
          <span class="text-sm text-gray-500">{{ formatDate(value) }}</span>
        </template>

        <template #cell-actions="{ row }">
          <div class="flex items-center justify-end gap-1" @click.stop>
            <AppButton
              variant="ghost"
              size="sm"
              @click="router.push({ name: 'users.edit', params: { id: row.id } })"
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
          :current-page="store.meta.current_page"
          :last-page="store.meta.last_page"
          :total="store.meta.total"
          :from="from"
          :to="to"
          :per-page="store.meta.per_page"
          @page-change="store.setFilter('page', $event)"
          @per-page-change="store.setFilter('per_page', $event)"
        />
      </div>
    </AppCard>
  </div>
</template>

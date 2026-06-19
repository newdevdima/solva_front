<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Plus, Users, TrendingUp, Pencil, Trash2 } from 'lucide-vue-next'
import { useTeamsStore } from '@/stores/teams.store'
import { useUiStore } from '@/stores/ui.store'
import { useToast } from '@/composables/useToast'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppSearchInput from '@/components/base/AppSearchInput.vue'
import AppModal from '@/components/base/AppModal.vue'
import AppInput from '@/components/base/AppInput.vue'
import AppTextarea from '@/components/base/AppTextarea.vue'
import AppSkeleton from '@/components/base/AppSkeleton.vue'
import AppPagination from '@/components/base/AppPagination.vue'

const router = useRouter()
const { t } = useI18n()
const store = useTeamsStore()
const ui = useUiStore()
const toast = useToast()

const showCreateModal = ref(false)
const editingTeam = ref(null)
const form = ref({ name: '', description: '' })
const formErrors = ref({})

const from = computed(() =>
  store.meta.total === 0 ? 0 : (store.meta.current_page - 1) * store.meta.per_page + 1,
)
const to = computed(() => Math.min(store.meta.current_page * store.meta.per_page, store.meta.total))

onMounted(() => store.fetchList())

function openCreate() {
  editingTeam.value = null
  form.value = { name: '', description: '' }
  formErrors.value = {}
  showCreateModal.value = true
}

function openEdit(team) {
  editingTeam.value = team
  form.value = { name: team.name, description: team.description ?? '' }
  formErrors.value = {}
  showCreateModal.value = true
}

function validate() {
  formErrors.value = {}
  if (!form.value.name.trim()) formErrors.value.name = 'Name is required'
  return Object.keys(formErrors.value).length === 0
}

async function submit() {
  if (!validate()) return
  try {
    if (editingTeam.value) {
      await store.update(editingTeam.value.id, form.value)
      toast.showSuccess('Team updated')
    } else {
      await store.create(form.value)
      toast.showSuccess('Team created')
    }
    showCreateModal.value = false
  } catch (e) {
    if (e?.errors) {
      formErrors.value = Object.fromEntries(
        Object.entries(e.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
      )
    } else {
      toast.showError(e?.message ?? 'Failed to save team')
    }
  }
}

async function handleDelete(team) {
  const ok = await ui.confirm('Delete Team', `Delete "${team.name}"? Members will be unassigned.`)
  if (!ok) return
  try {
    await store.remove(team.id)
    toast.showSuccess('Team deleted')
  } catch (e) {
    toast.showError(e?.message ?? 'Failed to delete team')
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
          <h1 class="text-2xl font-bold text-white">Teams</h1>
          <p class="text-sm text-indigo-200 mt-0.5">{{ store.meta.total }} teams configured</p>
        </div>
        <AppButton size="sm" class="!bg-white !text-primary hover:!bg-indigo-50" @click="openCreate">
          <template #icon><Plus class="w-4 h-4" /></template>
          New Team
        </AppButton>
      </div>
    </div>

    <!-- Search -->
    <AppCard padding="sm">
      <AppSearchInput
        :model-value="store.filters.search"
        placeholder="Search teams…"
        @update:model-value="store.setFilter('search', $event)"
      />
    </AppCard>

    <!-- Teams grid -->
    <div v-if="store.loading.list" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <AppCard v-for="n in 6" :key="n" padding="sm">
        <div class="space-y-2">
          <AppSkeleton height="20px" width="60%" />
          <AppSkeleton height="14px" />
          <AppSkeleton height="14px" width="40%" />
        </div>
      </AppCard>
    </div>

    <div v-else-if="store.list.length === 0" class="text-center py-16">
      <Users class="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-500">No teams yet. Create your first team.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <AppCard
        v-for="team in store.list"
        :key="team.id"
        padding="sm"
        class="cursor-pointer hover:shadow-md transition-shadow"
        @click="router.push({ name: 'teams.detail', params: { id: team.id } })"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-start gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
              <Users class="w-5 h-5 text-primary" />
            </div>
            <div class="min-w-0">
              <h3 class="font-medium text-gray-900 truncate">{{ team.name }}</h3>
              <p v-if="team.description" class="text-xs text-gray-500 mt-0.5 line-clamp-2">
                {{ team.description }}
              </p>
              <div class="flex items-center gap-3 mt-2">
                <span class="text-xs text-gray-500">
                  {{ team.members_count ?? 0 }} members
                </span>
                <span v-if="team.leads_count !== undefined" class="text-xs text-gray-500">
                  {{ team.leads_count }} leads
                </span>
              </div>
            </div>
          </div>
          <div class="flex gap-1 shrink-0" @click.stop>
            <button
              :title="t('common.edit')"
              class="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-primary-light transition-colors"
              @click="openEdit(team)"
            >
              <Pencil class="w-3.5 h-3.5" />
            </button>
            <button
              :title="t('common.delete')"
              class="p-1.5 rounded-lg text-gray-400 hover:text-danger hover:bg-danger-bg transition-colors"
              @click="handleDelete(team)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </AppCard>
    </div>

    <!-- Pagination -->
    <div v-if="store.meta.last_page > 1">
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

    <!-- Create / Edit Modal -->
    <AppModal
      :open="showCreateModal"
      :title="editingTeam ? 'Edit Team' : 'New Team'"
      size="sm"
      @close="showCreateModal = false"
    >
      <form class="space-y-4" @submit.prevent="submit">
        <AppInput
          v-model="form.name"
          label="Team Name"
          placeholder="e.g. Sales Team Alpha"
          :error="formErrors.name"
          required
        />
        <AppTextarea
          v-model="form.description"
          label="Description (optional)"
          placeholder="What is this team responsible for?"
          :rows="3"
        />
      </form>
      <template #footer>
        <AppButton variant="ghost" @click="showCreateModal = false">Cancel</AppButton>
        <AppButton :loading="store.loading.form" @click="submit">
          {{ editingTeam ? 'Save Changes' : 'Create Team' }}
        </AppButton>
      </template>
    </AppModal>
  </div>
</template>

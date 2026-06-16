<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Edit2, Trash2, Mail, Shield, Users } from 'lucide-vue-next'
import { useUsersStore } from '@/stores/users.store'
import { useUiStore } from '@/stores/ui.store'
import { useToast } from '@/composables/useToast'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppAvatar from '@/components/base/AppAvatar.vue'
import AppBadge from '@/components/base/AppBadge.vue'
import AppSkeleton from '@/components/base/AppSkeleton.vue'
import AppToggle from '@/components/base/AppToggle.vue'
import { ROLES } from '@/utils/enums'
import { formatDate } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const store = useUsersStore()
const ui = useUiStore()
const toast = useToast()

const id = route.params.id

onMounted(async () => {
  try {
    await store.fetchOne(id)
  } catch {
    router.replace({ name: 'users' })
  }
})

async function toggleActive() {
  try {
    await store.toggleStatus(id, !store.current.is_active)
    toast.showSuccess(store.current.is_active ? 'User activated' : 'User deactivated')
  } catch (e) {
    toast.showError(e?.message ?? 'Failed to update status')
  }
}

async function handleDelete() {
  const ok = await ui.confirm('Delete User', `Delete "${store.current?.name}"? This cannot be undone.`)
  if (!ok) return
  try {
    await store.remove(id)
    toast.showSuccess('User deleted')
    router.replace({ name: 'users' })
  } catch (e) {
    toast.showError(e?.message ?? 'Failed to delete user')
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-5">
    <div class="flex items-center gap-3">
      <AppButton variant="ghost" size="sm" @click="router.back()">
        <template #icon><ArrowLeft class="w-4 h-4" /></template>
        Back
      </AppButton>
    </div>

    <AppCard v-if="store.loading.detail">
      <div class="flex items-start gap-4">
        <AppSkeleton width="64px" height="64px" class="rounded-full shrink-0" />
        <div class="flex-1 space-y-2">
          <AppSkeleton height="20px" width="40%" />
          <AppSkeleton height="14px" width="60%" />
          <AppSkeleton height="14px" width="30%" />
        </div>
      </div>
    </AppCard>

    <AppCard v-else-if="store.current">
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div class="flex items-start gap-4">
          <AppAvatar :name="store.current.name" size="lg" />
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h1 class="text-xl font-semibold text-gray-900">{{ store.current.name }}</h1>
              <AppBadge
                :variant="!store.current.is_active ? 'neutral' : 'success'"
                :label="store.current.is_active ? 'Active' : 'Inactive'"
                dot
              />
            </div>
            <div class="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
              <Mail class="w-4 h-4" />
              <span>{{ store.current.email }}</span>
            </div>
            <div class="flex items-center gap-2 mt-1.5">
              <AppBadge
                :variant="store.current.role === 'super_admin' ? 'danger' : store.current.role === 'manager' ? 'warning' : 'info'"
                :label="ROLES[store.current.role] ?? store.current.role"
              />
              <span v-if="store.current.team" class="flex items-center gap-1 text-xs text-gray-500">
                <Users class="w-3.5 h-3.5" />
                {{ store.current.team.name }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <AppButton
            variant="ghost"
            size="sm"
            @click="router.push({ name: 'users.edit', params: { id } })"
          >
            <template #icon><Edit2 class="w-4 h-4" /></template>
            Edit
          </AppButton>
          <AppButton
            variant="ghost"
            size="sm"
            class="!text-danger"
            @click="handleDelete"
          >
            <template #icon><Trash2 class="w-4 h-4" /></template>
          </AppButton>
        </div>
      </div>

      <!-- Toggle active -->
      <div class="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-700">Account Status</p>
          <p class="text-xs text-gray-400 mt-0.5">
            {{ store.current.is_active ? 'This user can log in and use the CRM.' : 'This user is deactivated and cannot log in.' }}
          </p>
        </div>
        <AppToggle
          :model-value="store.current.is_active"
          :disabled="store.loading.action"
          @update:model-value="toggleActive"
        />
      </div>

      <!-- Meta info -->
      <div class="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Member Since</p>
          <p class="text-sm text-gray-900">{{ formatDate(store.current.created_at) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-400 uppercase tracking-wide mb-1">Last Updated</p>
          <p class="text-sm text-gray-900">{{ formatDate(store.current.updated_at) }}</p>
        </div>
      </div>
    </AppCard>
  </div>
</template>

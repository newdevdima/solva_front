<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useAppointmentsStore } from '@/stores/appointments.store'
import { useUsersStore } from '@/stores/users.store'
import { useToast } from '@/composables/useToast'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppInput from '@/components/base/AppInput.vue'
import AppSelect from '@/components/base/AppSelect.vue'
import AppTextarea from '@/components/base/AppTextarea.vue'
import AppSkeleton from '@/components/base/AppSkeleton.vue'
import { APPOINTMENT_STATUS_OPTIONS } from '@/utils/enums'

const route = useRoute()
const router = useRouter()
const store = useAppointmentsStore()
const usersStore = useUsersStore()
const toast = useToast()

const id = route.params.id

const form = reactive({
  scheduled_at: '',
  status: '',
  assigned_to: '',
  notes: '',
})
const errors = ref({})
const agentOptions = ref([{ value: '', label: 'Unassigned' }])

onMounted(async () => {
  try {
    await Promise.all([store.fetchOne(id), usersStore.fetchList({ role: 'agent', per_page: 100 })])
    const apt = store.current
    if (apt) {
      form.scheduled_at = apt.scheduled_at ? apt.scheduled_at.slice(0, 16) : ''
      form.status = apt.status ?? ''
      form.assigned_to = apt.assigned_to?.id ?? ''
      form.notes = apt.notes ?? ''
    }
    agentOptions.value = [
      { value: '', label: 'Unassigned' },
      ...usersStore.list.map((u) => ({ value: u.id, label: u.name })),
    ]
  } catch {
    toast.showError('Failed to load appointment')
    router.replace({ name: 'appointments' })
  }
})

function validate() {
  errors.value = {}
  if (!form.scheduled_at) errors.value.scheduled_at = 'Date & time is required'
  return Object.keys(errors.value).length === 0
}

async function submit() {
  if (!validate()) return
  try {
    const payload = { ...form }
    if (!payload.assigned_to) delete payload.assigned_to
    await store.update(id, payload)
    toast.showSuccess('Appointment updated')
    router.push({ name: 'appointments.detail', params: { id } })
  } catch (e) {
    if (e?.errors) {
      errors.value = Object.fromEntries(
        Object.entries(e.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
      )
    } else {
      toast.showError(e?.message ?? 'Failed to update appointment')
    }
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
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Edit Appointment</h1>
      </div>
    </div>

    <AppCard v-if="store.loading.detail">
      <div class="space-y-4">
        <AppSkeleton v-for="n in 4" :key="n" height="44px" />
      </div>
    </AppCard>

    <AppCard v-else>
      <form class="space-y-5" @submit.prevent="submit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppInput
            v-model="form.scheduled_at"
            type="datetime-local"
            label="Date & Time"
            :error="errors.scheduled_at"
            required
          />
          <AppSelect
            v-model="form.status"
            label="Status"
            :options="APPOINTMENT_STATUS_OPTIONS"
          />
          <AppSelect
            v-model="form.assigned_to"
            label="Assigned To"
            :options="agentOptions"
            class="sm:col-span-2"
          />
        </div>

        <AppTextarea
          v-model="form.notes"
          label="Notes"
          :rows="3"
        />

        <div class="flex items-center justify-end gap-3">
          <AppButton variant="ghost" type="button" @click="router.back()">Cancel</AppButton>
          <AppButton type="submit" :loading="store.loading.form">Save Changes</AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

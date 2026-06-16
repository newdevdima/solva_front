<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useAppointmentsStore } from '@/stores/appointments.store'
import { useLeadsStore } from '@/stores/leads.store'
import { useUsersStore } from '@/stores/users.store'
import { useToast } from '@/composables/useToast'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppInput from '@/components/base/AppInput.vue'
import AppSelect from '@/components/base/AppSelect.vue'
import AppTextarea from '@/components/base/AppTextarea.vue'
import { APPOINTMENT_STATUS_OPTIONS, REMINDER_CHANNEL_OPTIONS } from '@/utils/enums'

const router = useRouter()
const store = useAppointmentsStore()
const leadsStore = useLeadsStore()
const usersStore = useUsersStore()
const toast = useToast()

const form = reactive({
  lead_id: '',
  assigned_to: '',
  scheduled_at: '',
  status: 'PLANIFIE',
  notes: '',
})
const errors = ref({})

const leadOptions = ref([{ value: '', label: 'Select lead…' }])
const agentOptions = ref([{ value: '', label: 'Unassigned' }])

onMounted(async () => {
  await Promise.all([
    leadsStore.fetchList({ per_page: 100 }),
    usersStore.fetchList({ role: 'agent', per_page: 100 }),
  ])
  leadOptions.value = [
    { value: '', label: 'Select lead…' },
    ...leadsStore.list.map((l) => ({ value: l.id, label: `${l.name} — ${l.phone ?? l.email ?? ''}` })),
  ]
  agentOptions.value = [
    { value: '', label: 'Unassigned' },
    ...usersStore.list.map((u) => ({ value: u.id, label: u.name })),
  ]
})

function validate() {
  errors.value = {}
  if (!form.lead_id) errors.value.lead_id = 'Lead is required'
  if (!form.scheduled_at) errors.value.scheduled_at = 'Date & time is required'
  return Object.keys(errors.value).length === 0
}

async function submit() {
  if (!validate()) return
  try {
    const payload = { ...form }
    if (!payload.assigned_to) delete payload.assigned_to
    if (!payload.notes) delete payload.notes
    const apt = await store.create(payload)
    toast.showSuccess('Appointment created')
    router.push({ name: 'appointments.detail', params: { id: apt.id } })
  } catch (e) {
    if (e?.errors) {
      errors.value = Object.fromEntries(
        Object.entries(e.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
      )
    } else {
      toast.showError(e?.message ?? 'Failed to create appointment')
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
        <h1 class="text-xl font-semibold text-gray-900">New Appointment</h1>
        <p class="text-sm text-gray-500 mt-0.5">Schedule an appointment for a lead.</p>
      </div>
    </div>

    <AppCard>
      <form class="space-y-5" @submit.prevent="submit">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AppSelect
            v-model="form.lead_id"
            label="Lead"
            :options="leadOptions"
            :error="errors.lead_id"
            required
            class="sm:col-span-2"
          />
          <AppInput
            v-model="form.scheduled_at"
            type="datetime-local"
            label="Date & Time"
            :error="errors.scheduled_at"
            required
          />
          <AppSelect
            v-model="form.status"
            label="Initial Status"
            :options="APPOINTMENT_STATUS_OPTIONS"
          />
          <AppSelect
            v-model="form.assigned_to"
            label="Assigned To"
            :options="agentOptions"
            class="sm:col-span-2"
          />
        </div>

        <div class="border-t border-gray-100" />

        <AppTextarea
          v-model="form.notes"
          label="Notes (optional)"
          placeholder="Any notes about this appointment…"
          :rows="3"
        />

        <div class="flex items-center justify-end gap-3">
          <AppButton variant="ghost" type="button" @click="router.back()">Cancel</AppButton>
          <AppButton type="submit" :loading="store.loading.form">Create Appointment</AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

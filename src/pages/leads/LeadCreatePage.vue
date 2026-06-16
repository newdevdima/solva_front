<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useLeadsStore } from '@/stores/leads.store'
import { useLeadSourcesStore } from '@/stores/leadSources.store'
import { useUsersStore } from '@/stores/users.store'
import { useToast } from '@/composables/useToast'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppInput from '@/components/base/AppInput.vue'
import AppSelect from '@/components/base/AppSelect.vue'
import AppTextarea from '@/components/base/AppTextarea.vue'
import { INSURANCE_TYPE_OPTIONS } from '@/utils/enums'

const router = useRouter()
const leadsStore = useLeadsStore()
const sourcesStore = useLeadSourcesStore()
const usersStore = useUsersStore()
const toast = useToast()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  insurance_type: '',
  source_id: '',
  assigned_to: '',
  notes: '',
})

const errors = ref({})

const agentOptions = ref([{ value: '', label: 'Unassigned' }])
const sourceOptions = ref([{ value: '', label: 'No Source' }])

onMounted(async () => {
  await Promise.all([sourcesStore.fetchList(), usersStore.fetchList({ role: 'agent', per_page: 100 })])
  sourceOptions.value = [
    { value: '', label: 'No Source' },
    ...sourcesStore.list.map((s) => ({ value: s.id, label: s.name })),
  ]
  agentOptions.value = [
    { value: '', label: 'Unassigned' },
    ...usersStore.list.map((u) => ({ value: u.id, label: u.name })),
  ]
})

function validate() {
  errors.value = {}
  if (!form.name.trim()) errors.value.name = 'Name is required'
  if (!form.phone.trim()) errors.value.phone = 'Phone is required'
  if (!form.insurance_type) errors.value.insurance_type = 'Insurance type is required'
  return Object.keys(errors.value).length === 0
}

async function submit() {
  if (!validate()) return
  try {
    const payload = { ...form }
    if (!payload.source_id) delete payload.source_id
    if (!payload.assigned_to) delete payload.assigned_to
    if (!payload.notes) delete payload.notes
    const lead = await leadsStore.create(payload)
    toast.showSuccess('Lead created successfully')
    router.push({ name: 'leads.detail', params: { id: lead.id } })
  } catch (e) {
    if (e?.errors) {
      errors.value = Object.fromEntries(
        Object.entries(e.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
      )
    } else {
      toast.showError(e?.message ?? 'Failed to create lead')
    }
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-5">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <AppButton variant="ghost" size="sm" @click="router.back()">
        <template #icon><ArrowLeft class="w-4 h-4" /></template>
        Back
      </AppButton>
      <div>
        <h1 class="text-xl font-semibold text-gray-900">New Lead</h1>
        <p class="text-sm text-gray-500">Fill in the lead details below.</p>
      </div>
    </div>

    <AppCard>
      <form class="space-y-5" @submit.prevent="submit">
        <!-- Personal info -->
        <div>
          <h2 class="text-sm font-semibold text-gray-700 mb-3">Personal Information</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppInput
              v-model="form.name"
              label="Full Name"
              placeholder="John Doe"
              :error="errors.name"
              required
            />
            <AppInput
              v-model="form.phone"
              label="Phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              :error="errors.phone"
              required
            />
            <AppInput
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="john@example.com"
              :error="errors.email"
              class="sm:col-span-2"
            />
          </div>
        </div>

        <div class="border-t border-gray-100" />

        <!-- Insurance + Source -->
        <div>
          <h2 class="text-sm font-semibold text-gray-700 mb-3">Lead Details</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppSelect
              v-model="form.insurance_type"
              label="Insurance Type"
              :options="INSURANCE_TYPE_OPTIONS"
              placeholder="Select type…"
              :error="errors.insurance_type"
              required
            />
            <AppSelect
              v-model="form.source_id"
              label="Lead Source"
              :options="sourceOptions"
              placeholder="Select source…"
            />
            <AppSelect
              v-model="form.assigned_to"
              label="Assign To"
              :options="agentOptions"
              placeholder="Unassigned"
              class="sm:col-span-2"
            />
          </div>
        </div>

        <div class="border-t border-gray-100" />

        <!-- Notes -->
        <div>
          <h2 class="text-sm font-semibold text-gray-700 mb-3">Notes (optional)</h2>
          <AppTextarea
            v-model="form.notes"
            placeholder="Add any initial notes about this lead…"
            :rows="3"
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <AppButton variant="ghost" type="button" @click="router.back()">Cancel</AppButton>
          <AppButton type="submit" :loading="leadsStore.loading.form">Create Lead</AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

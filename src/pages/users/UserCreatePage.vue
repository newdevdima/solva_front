<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useUsersStore } from '@/stores/users.store'
import { useTeamsStore } from '@/stores/teams.store'
import { useToast } from '@/composables/useToast'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'
import AppInput from '@/components/base/AppInput.vue'
import AppSelect from '@/components/base/AppSelect.vue'
import { ROLE_OPTIONS } from '@/utils/enums'

const router = useRouter()
const store = useUsersStore()
const teamsStore = useTeamsStore()
const toast = useToast()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  role: 'agent',
  team_id: '',
})
const errors = ref({})
const teamOptions = ref([{ value: '', label: 'No Team' }])

onMounted(async () => {
  await teamsStore.fetchList()
  teamOptions.value = [
    { value: '', label: 'No Team' },
    ...teamsStore.list.map((t) => ({ value: t.id, label: t.name })),
  ]
})

function validate() {
  errors.value = {}
  if (!form.name.trim()) errors.value.name = 'Name is required'
  if (!form.email.trim()) errors.value.email = 'Email is required'
  if (!form.password) errors.value.password = 'Password is required'
  if (form.password && form.password.length < 8) errors.value.password = 'Password must be at least 8 characters'
  if (form.password !== form.password_confirmation)
    errors.value.password_confirmation = 'Passwords do not match'
  if (!form.role) errors.value.role = 'Role is required'
  return Object.keys(errors.value).length === 0
}

async function submit() {
  if (!validate()) return
  try {
    const payload = { ...form }
    if (!payload.team_id) delete payload.team_id
    const user = await store.create(payload)
    toast.showSuccess('User created successfully')
    router.push({ name: 'users.detail', params: { id: user.id } })
  } catch (e) {
    if (e?.errors) {
      errors.value = Object.fromEntries(
        Object.entries(e.errors).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v]),
      )
    } else {
      toast.showError(e?.message ?? 'Failed to create user')
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
        <h1 class="text-xl font-semibold text-gray-900">New User</h1>
        <p class="text-sm text-gray-500">Create a new CRM user account.</p>
      </div>
    </div>

    <AppCard>
      <form class="space-y-5" @submit.prevent="submit">
        <div>
          <h2 class="text-sm font-semibold text-gray-700 mb-3">Account Details</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppInput
              v-model="form.name"
              label="Full Name"
              placeholder="Jane Doe"
              :error="errors.name"
              required
              class="sm:col-span-2"
            />
            <AppInput
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="jane@company.com"
              :error="errors.email"
              required
              class="sm:col-span-2"
            />
            <AppInput
              v-model="form.password"
              label="Password"
              type="password"
              :error="errors.password"
              required
            />
            <AppInput
              v-model="form.password_confirmation"
              label="Confirm Password"
              type="password"
              :error="errors.password_confirmation"
              required
            />
          </div>
        </div>

        <div class="border-t border-gray-100" />

        <div>
          <h2 class="text-sm font-semibold text-gray-700 mb-3">Role & Team</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AppSelect
              v-model="form.role"
              label="Role"
              :options="ROLE_OPTIONS"
              :error="errors.role"
              required
            />
            <AppSelect
              v-model="form.team_id"
              label="Team"
              :options="teamOptions"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3">
          <AppButton variant="ghost" type="button" @click="router.back()">Cancel</AppButton>
          <AppButton type="submit" :loading="store.loading.form">Create User</AppButton>
        </div>
      </form>
    </AppCard>
  </div>
</template>

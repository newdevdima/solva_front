<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import AppInput from '@/components/base/AppInput.vue'
import AppButton from '@/components/base/AppButton.vue'
import { User, Mail, Lock } from 'lucide-vue-next'

const auth = useAuthStore()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '', password_confirmation: '' })
const errors = reactive({ name: '', email: '', password: '', password_confirmation: '', general: '' })
const loading = ref(false)

function validate() {
  Object.keys(errors).forEach((k) => (errors[k] = ''))
  let ok = true
  if (!form.name) { errors.name = 'Full name is required.'; ok = false }
  if (!form.email) { errors.email = 'Email is required.'; ok = false }
  if (!form.password) { errors.password = 'Password is required.'; ok = false }
  else if (form.password.length < 8) { errors.password = 'Password must be at least 8 characters.'; ok = false }
  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match.'
    ok = false
  }
  return ok
}

async function submit() {
  if (!validate()) return
  loading.value = true
  try {
    await auth.register(form)
    router.push('/dashboard')
  } catch (err) {
    if (err.type === 'validation') {
      Object.entries(err.errors ?? {}).forEach(([key, msgs]) => {
        if (key in errors) errors[key] = msgs[0]
      })
    } else {
      errors.general = err.message ?? 'Registration failed.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
    <p class="text-sm text-gray-500 mb-8">You'll be assigned the Agent role by default.</p>

    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <div
        v-if="errors.general"
        class="px-4 py-3 rounded-xl bg-danger-bg border border-danger/20 text-sm text-danger"
      >
        {{ errors.general }}
      </div>

      <AppInput
        v-model="form.name"
        label="Full name"
        placeholder="Jane Dupont"
        :error="errors.name"
        required
      >
        <template #prefix><User class="w-4 h-4" /></template>
      </AppInput>

      <AppInput
        v-model="form.email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        :error="errors.email"
        required
        autocomplete="email"
      >
        <template #prefix><Mail class="w-4 h-4" /></template>
      </AppInput>

      <AppInput
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="Min. 8 characters"
        :error="errors.password"
        required
        autocomplete="new-password"
      >
        <template #prefix><Lock class="w-4 h-4" /></template>
      </AppInput>

      <AppInput
        v-model="form.password_confirmation"
        label="Confirm password"
        type="password"
        placeholder="Repeat password"
        :error="errors.password_confirmation"
        required
        autocomplete="new-password"
      >
        <template #prefix><Lock class="w-4 h-4" /></template>
      </AppInput>

      <AppButton type="submit" variant="primary" size="lg" :loading="loading" class="w-full mt-2">
        Create account
      </AppButton>
    </form>

    <p class="mt-6 text-center text-sm text-gray-500">
      Already have an account?
      <RouterLink to="/login" class="text-primary font-medium hover:underline">Sign in</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Upload, FileText, X } from 'lucide-vue-next'
import { useLeadImportsStore } from '@/stores/leadImports.store'
import { useToast } from '@/composables/useToast'
import AppCard from '@/components/base/AppCard.vue'
import AppButton from '@/components/base/AppButton.vue'

const router = useRouter()
const store = useLeadImportsStore()
const toast = useToast()

const file = ref(null)
const dragOver = ref(false)
const fileError = ref('')
const inputRef = ref(null)

function onFileChange(e) {
  const selected = e.target.files?.[0]
  setFile(selected)
}

function onDrop(e) {
  dragOver.value = false
  const dropped = e.dataTransfer?.files?.[0]
  setFile(dropped)
}

function setFile(f) {
  fileError.value = ''
  if (!f) return
  if (!f.name.endsWith('.csv')) {
    fileError.value = 'Only CSV files are supported.'
    return
  }
  if (f.size > 10 * 1024 * 1024) {
    fileError.value = 'File size must be under 10 MB.'
    return
  }
  file.value = f
}

function clearFile() {
  file.value = null
  fileError.value = ''
  if (inputRef.value) inputRef.value.value = ''
}

async function submit() {
  if (!file.value) {
    fileError.value = 'Please select a CSV file.'
    return
  }
  try {
    const job = await store.upload(file.value)
    toast.showSuccess('Import started! We will process your file shortly.')
    router.push({ name: 'lead-imports' })
  } catch (e) {
    toast.showError(e?.message ?? 'Failed to upload file')
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
        <h1 class="text-xl font-semibold text-gray-900">Import Leads</h1>
        <p class="text-sm text-gray-500 mt-0.5">Upload a CSV file to bulk import leads.</p>
      </div>
    </div>

    <AppCard>
      <!-- Instructions -->
      <div class="bg-info-bg rounded-xl p-4 text-sm text-info mb-5">
        <p class="font-medium mb-1">CSV Format Requirements</p>
        <ul class="list-disc list-inside space-y-0.5 text-xs text-blue-700">
          <li>Required columns: <strong>name</strong>, <strong>phone</strong></li>
          <li>Optional: email, insurance_type, source</li>
          <li>First row must be the header row</li>
          <li>Maximum file size: 10 MB</li>
        </ul>
      </div>

      <!-- Drop zone -->
      <div
        :class="[
          'border-2 border-dashed rounded-xl transition-colors cursor-pointer',
          dragOver ? 'border-primary bg-primary-light/50' : 'border-gray-200 hover:border-primary/50',
          fileError ? 'border-danger bg-danger-bg/30' : '',
        ]"
        @dragover.prevent="dragOver = true"
        @dragleave.prevent="dragOver = false"
        @drop.prevent="onDrop"
        @click="inputRef?.click()"
      >
        <input
          ref="inputRef"
          type="file"
          accept=".csv"
          class="hidden"
          @change="onFileChange"
        />

        <div v-if="!file" class="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div class="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Upload class="w-7 h-7 text-gray-400" />
          </div>
          <p class="text-sm font-medium text-gray-700">Drop your CSV here, or click to browse</p>
          <p class="text-xs text-gray-400 mt-1">CSV files only, up to 10 MB</p>
        </div>

        <div v-else class="flex items-center gap-4 p-4" @click.stop>
          <div class="w-12 h-12 rounded-xl bg-success-bg flex items-center justify-center shrink-0">
            <FileText class="w-6 h-6 text-success" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 text-sm truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-400 mt-0.5">{{ formatSize(file.size) }}</p>
          </div>
          <button
            class="p-1.5 rounded-lg text-gray-400 hover:text-danger hover:bg-danger-bg transition-colors"
            @click.stop="clearFile"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <p v-if="fileError" class="text-xs text-danger mt-2">{{ fileError }}</p>

      <div class="flex items-center justify-end gap-3 mt-5">
        <AppButton variant="ghost" @click="router.back()">Cancel</AppButton>
        <AppButton
          :loading="store.loading.upload"
          :disabled="!file"
          @click="submit"
        >
          <template #icon><Upload class="w-4 h-4" /></template>
          Start Import
        </AppButton>
      </div>
    </AppCard>
  </div>
</template>

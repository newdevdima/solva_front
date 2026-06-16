<script setup>
import { ref } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import LeadStatusBadge from './LeadStatusBadge.vue'
import { LEAD_STATUS_OPTIONS } from '@/utils/enums'

const props = defineProps({
  status: { type: String, required: true },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['change'])

const open = ref(false)

function select(value) {
  if (value !== props.status) emit('change', value)
  open.value = false
}
</script>

<template>
  <div class="relative inline-block">
    <button
      class="inline-flex items-center gap-1.5 focus:outline-none disabled:opacity-50"
      :disabled="loading"
      @click="open = !open"
      @blur.capture="() => setTimeout(() => (open = false), 150)"
    >
      <LeadStatusBadge :status="status" dot />
      <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute left-0 top-full mt-1 z-30 w-52 bg-white rounded-xl shadow-modal border border-gray-100 py-1 origin-top-left"
      >
        <button
          v-for="s in LEAD_STATUS_OPTIONS"
          :key="s.value"
          class="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
          @click="select(s.value)"
        >
          <LeadStatusBadge :status="s.value" />
          <Check v-if="s.value === status" class="w-3.5 h-3.5 text-primary" />
        </button>
      </div>
    </Transition>
  </div>
</template>

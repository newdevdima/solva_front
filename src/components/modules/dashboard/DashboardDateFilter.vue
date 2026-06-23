<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CalendarDays } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ days: 30, from: null, to: null }),
  },
})
const emit = defineEmits(['update:modelValue'])
const { t } = useI18n()

const presets = computed(() => [
  { label: t('dashboard.today'), days: 1 },
  { label: t('dashboard.days7'), days: 7 },
  { label: t('dashboard.days30'), days: 30 },
  { label: t('dashboard.days90'), days: 90 },
])

const activePreset = computed(() =>
  props.modelValue.from ? null : (props.modelValue.days ?? 30),
)

function selectPreset(days) {
  emit('update:modelValue', { days, from: null, to: null })
}
</script>

<template>
  <div class="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1">
    <CalendarDays class="w-3.5 h-3.5 text-gray-400 ml-1.5" />
    <button
      v-for="p in presets"
      :key="p.days"
      type="button"
      @click="selectPreset(p.days)"
      :class="[
        'px-3 py-1 rounded-lg text-xs font-medium transition-all',
        activePreset === p.days
          ? 'bg-primary text-white shadow-sm'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
      ]"
    >
      {{ p.label }}
    </button>
  </div>
</template>

<script setup>
import { useId } from 'vue'

defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const id = useId()
</script>

<template>
  <div class="flex items-center gap-3">
    <button
      :id="id"
      role="switch"
      type="button"
      :aria-checked="modelValue"
      :disabled="disabled"
      :class="[
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
        'transition-colors duration-200 ease-in-out focus:outline-none focus-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        modelValue ? 'bg-primary' : 'bg-gray-200',
      ]"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span
        :class="[
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow',
          'transform transition-transform duration-200 ease-in-out',
          modelValue ? 'translate-x-5' : 'translate-x-0',
        ]"
      />
    </button>

    <label
      v-if="label"
      :for="id"
      class="text-sm text-gray-700 cursor-pointer select-none"
      @click="!disabled && emit('update:modelValue', !modelValue)"
    >
      {{ label }}
    </label>
  </div>
</template>

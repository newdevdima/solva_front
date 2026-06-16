<script setup>
import AppSpinner from './AppSpinner.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    // primary | secondary | ghost | danger | icon
  },
  size: {
    type: String,
    default: 'md',
    // sm | md | lg
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  as: { type: String, default: 'button' },
})

const variantClasses = {
  primary:
    'bg-primary hover:bg-primary-hover text-white border-transparent shadow-sm',
  secondary:
    'bg-white hover:bg-gray-50 text-primary border-primary',
  ghost:
    'bg-transparent hover:bg-gray-100 text-gray-500 border-transparent',
  danger:
    'bg-danger hover:bg-red-600 text-white border-transparent shadow-sm',
  icon:
    'bg-transparent hover:bg-gray-100 text-gray-500 border-gray-200',
}

const sizeClasses = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2 rounded-2xl',
}
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? type : undefined"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium border transition-all duration-150 select-none',
      'focus:outline-none focus-ring',
      'disabled:opacity-45 disabled:cursor-not-allowed',
      variantClasses[variant],
      sizeClasses[size],
      loading ? 'cursor-wait' : '',
    ]"
  >
    <!-- Leading slot (icon) -->
    <span v-if="$slots.icon && !loading" class="shrink-0">
      <slot name="icon" />
    </span>

    <!-- Loading spinner -->
    <AppSpinner v-if="loading" :size="size === 'lg' ? 20 : 16" class="shrink-0" />

    <!-- Label -->
    <span v-if="$slots.default">
      <slot />
    </span>

    <!-- Trailing slot -->
    <span v-if="$slots.trailing" class="shrink-0">
      <slot name="trailing" />
    </span>
  </component>
</template>

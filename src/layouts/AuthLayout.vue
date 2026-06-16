<script setup>
// Centered card layout for login / register / error pages
</script>

<template>
  <div class="min-h-screen gradient-hero flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo mark -->
      <div class="flex justify-center mb-8">
        <div class="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
          <svg viewBox="0 0 24 24" class="w-7 h-7 text-white fill-current">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-modal p-8">
        <slot />
      </div>
    </div>
  </div>
</template>

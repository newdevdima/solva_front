<script setup>
import { computed } from 'vue'

const props = defineProps({
  segments: {
    type: Array,
    default: () => [],
    // [{ label: string, value: number, color: string }]
  },
  centerLabel: { type: String, default: 'Total' },
})

/* ── Donut geometry ────────────────────────────────────────── */
const R = 68
const STROKE_W = 22
const CIRCUMFERENCE = 2 * Math.PI * R  // ≈ 427.3

/* ── Computed ──────────────────────────────────────────────── */
const total = computed(() => props.segments.reduce((s, seg) => s + (seg.value || 0), 0))

const svgSegments = computed(() => {
  const t = total.value
  if (t === 0) return []

  let cumLen = 0
  return props.segments
    .filter((seg) => seg.value > 0)
    .map((seg) => {
      const segLen = (seg.value / t) * CIRCUMFERENCE
      // Offset: start at 12 o'clock (quarter-circle backwards)
      const dashOffset = CIRCUMFERENCE / 4 - cumLen
      cumLen += segLen
      return {
        ...seg,
        dashArray: `${segLen.toFixed(3)} ${(CIRCUMFERENCE - segLen).toFixed(3)}`,
        dashOffset: dashOffset.toFixed(3),
        pct: Math.round((seg.value / t) * 100),
      }
    })
})

function fmt(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center gap-6">
    <!-- Donut SVG -->
    <div class="relative shrink-0 w-44 h-44">
      <svg viewBox="0 0 200 200" class="w-full h-full -rotate-90" aria-hidden="true">
        <!-- Track ring -->
        <circle
          cx="100" cy="100" :r="R"
          fill="none" stroke="#F3F4F6" :stroke-width="STROKE_W"
        />
        <!-- Segment rings -->
        <circle
          v-for="seg in svgSegments"
          :key="seg.label"
          cx="100" cy="100" :r="R"
          fill="none"
          :stroke="seg.color"
          :stroke-width="STROKE_W"
          :stroke-dasharray="seg.dashArray"
          :stroke-dashoffset="seg.dashOffset"
          stroke-linecap="butt"
        />
      </svg>
      <!-- Center text (not rotated) -->
      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span class="text-2xl font-bold text-gray-900 tabular-nums leading-none">{{ fmt(total) }}</span>
        <span class="text-xs text-gray-400 mt-1">{{ centerLabel }}</span>
      </div>
    </div>

    <!-- Legend -->
    <ul class="flex flex-col gap-2.5 flex-1 min-w-0">
      <li
        v-for="seg in segments"
        :key="seg.label"
        class="flex items-center gap-2.5"
      >
        <span
          class="w-2.5 h-2.5 rounded-full shrink-0"
          :style="{ background: seg.color }"
        />
        <span class="text-sm text-gray-600 flex-1 truncate">{{ seg.label }}</span>
        <span class="text-sm font-semibold text-gray-900 tabular-nums">{{ seg.value }}</span>
        <span class="text-xs text-gray-400 w-8 text-right tabular-nums">
          {{ total > 0 ? Math.round((seg.value / total) * 100) : 0 }}%
        </span>
      </li>
    </ul>
  </div>
</template>

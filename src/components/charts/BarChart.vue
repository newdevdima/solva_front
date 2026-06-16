<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },  // [{ [keyX]: string, [keyY]: number }]
  keyX: { type: String, default: 'date' },
  keyY: { type: String, default: 'count' },
  color: { type: String, default: '#6366f1' },
  barRadius: { type: Number, default: 4 },
})

/* ── Layout ────────────────────────────────────────────────── */
const VB_W = 600
const VB_H = 220
const PAD = { l: 44, r: 12, t: 16, b: 36 }
const PLOT_W = VB_W - PAD.l - PAD.r
const PLOT_H = VB_H - PAD.t - PAD.b

const uid = useId()

function f(n) { return n.toFixed(2) }

function niceMax(v) {
  if (!v || v <= 0) return 10
  const mag = Math.pow(10, Math.floor(Math.log10(v)))
  const n = v / mag
  if (n <= 1) return mag
  if (n <= 2) return 2 * mag
  if (n <= 5) return 5 * mag
  return 10 * mag
}

function formatDateShort(raw) {
  try {
    const d = new Date(raw)
    if (!isNaN(d)) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  } catch { /* ignore */ }
  return String(raw).slice(0, 6)
}

/* ── Computed ──────────────────────────────────────────────── */
const maxY = computed(() => {
  const vals = props.data.map((d) => Number(d[props.keyY]) || 0)
  return niceMax(Math.max(...vals, 1))
})

const yTicks = computed(() => {
  const steps = 4
  return Array.from({ length: steps + 1 }, (_, i) => {
    const v = Math.round((maxY.value / steps) * (steps - i))
    return { value: v, y: PAD.t + (v === 0 ? PLOT_H : (1 - v / maxY.value) * PLOT_H) }
  })
})

const bars = computed(() => {
  const n = props.data.length
  if (n === 0) return []
  const totalGap = PLOT_W * 0.08
  const barW = Math.max(4, (PLOT_W - totalGap * (n + 1)) / n)
  const slotW = PLOT_W / n

  return props.data.map((d, i) => {
    const v = Number(d[props.keyY]) || 0
    const barH = (v / maxY.value) * PLOT_H
    const x = PAD.l + i * slotW + (slotW - barW) / 2
    const y = PAD.t + PLOT_H - barH
    return { x, y, w: barW, h: barH, value: v, label: d[props.keyX] }
  })
})

/* Show at most 7 X labels */
const xLabels = computed(() => {
  const n = bars.value.length
  if (n === 0) return []
  const maxLabels = 7
  const step = n <= maxLabels ? 1 : Math.ceil(n / maxLabels)
  return bars.value.filter((_, i) => i % step === 0 || i === n - 1)
})
</script>

<template>
  <div class="w-full overflow-hidden">
    <svg
      :viewBox="`0 0 ${VB_W} ${VB_H}`"
      preserveAspectRatio="xMidYMid meet"
      class="w-full h-auto"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="`bar-lg-${uid}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="1" />
          <stop offset="100%" :stop-color="color" stop-opacity="0.75" />
        </linearGradient>
      </defs>

      <!-- Grid lines -->
      <line
        v-for="tick in yTicks"
        :key="tick.value"
        :x1="PAD.l" :y1="f(tick.y)"
        :x2="VB_W - PAD.r" :y2="f(tick.y)"
        stroke="#E5E7EB" stroke-width="1"
      />

      <!-- Y labels -->
      <text
        v-for="tick in yTicks"
        :key="`yl-${tick.value}`"
        :x="PAD.l - 8" :y="f(tick.y + 4)"
        text-anchor="end" font-size="11" fill="#9CA3AF"
        font-family="Inter, system-ui, sans-serif"
      >{{ tick.value }}</text>

      <!-- Bars -->
      <rect
        v-for="bar in bars"
        :key="bar.label"
        :x="f(bar.x)"
        :y="f(bar.h > 0 ? bar.y : PAD.t + PLOT_H)"
        :width="f(bar.w)"
        :height="f(Math.max(bar.h, 2))"
        :rx="barRadius"
        :ry="barRadius"
        :fill="`url(#bar-lg-${uid})`"
      />

      <!-- X labels -->
      <text
        v-for="bar in xLabels"
        :key="`xl-${bar.label}`"
        :x="f(bar.x + bar.w / 2)"
        :y="PAD.t + PLOT_H + 24"
        text-anchor="middle" font-size="11" fill="#9CA3AF"
        font-family="Inter, system-ui, sans-serif"
      >{{ formatDateShort(bar.label) }}</text>
    </svg>
  </div>
</template>

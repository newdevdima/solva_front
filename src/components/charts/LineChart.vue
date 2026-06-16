<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },  // [{ [keyX]: string, [keyY]: number }]
  keyX: { type: String, default: 'date' },
  keyY: { type: String, default: 'count' },
  color: { type: String, default: '#6366f1' },
  label: { type: String, default: '' },
})

/* ── SVG layout constants ──────────────────────────────────── */
const VB_W = 600
const VB_H = 220
const PAD = { l: 44, r: 12, t: 16, b: 36 }
const PLOT_W = VB_W - PAD.l - PAD.r  // 544
const PLOT_H = VB_H - PAD.t - PAD.b  // 168

const uid = useId()

/* ── Helpers ───────────────────────────────────────────────── */
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
  return raw
}

/* ── Derived geometry ──────────────────────────────────────── */
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

const points = computed(() => {
  const n = props.data.length
  if (n === 0) return []
  return props.data.map((d, i) => ({
    x: PAD.l + (n === 1 ? PLOT_W / 2 : (i / (n - 1)) * PLOT_W),
    y: PAD.t + (1 - (Number(d[props.keyY]) || 0) / maxY.value) * PLOT_H,
    value: Number(d[props.keyY]) || 0,
    label: d[props.keyX],
  }))
})

/* Catmull-Rom → cubic bezier */
function smooth(pts) {
  if (pts.length === 0) return ''
  if (pts.length === 1) return `M${f(pts[0].x)} ${f(pts[0].y)}`
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`
  for (let i = 1; i < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 2)]
    const p1 = pts[i - 1]
    const p2 = pts[i]
    const p3 = pts[Math.min(pts.length - 1, i + 1)]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C${f(cp1x)} ${f(cp1y)},${f(cp2x)} ${f(cp2y)},${f(p2.x)} ${f(p2.y)}`
  }
  return d
}

const linePath = computed(() => smooth(points.value))

const areaPath = computed(() => {
  const pts = points.value
  if (pts.length === 0) return ''
  const base = PAD.t + PLOT_H
  return `${smooth(pts)} L${f(pts[pts.length - 1].x)} ${f(base)} L${f(pts[0].x)} ${f(base)} Z`
})

/* Show at most 7 X labels */
const xLabels = computed(() => {
  const pts = points.value
  if (pts.length === 0) return []
  const max = 7
  const step = pts.length <= max ? 1 : Math.ceil(pts.length / max)
  return pts.filter((_, i) => i % step === 0 || i === pts.length - 1)
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
        <linearGradient :id="`lg-${uid}`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="color" stop-opacity="0.22" />
          <stop offset="85%" :stop-color="color" stop-opacity="0.03" />
          <stop offset="100%" :stop-color="color" stop-opacity="0" />
        </linearGradient>
        <clipPath :id="`clip-${uid}`">
          <rect :x="PAD.l" :y="PAD.t" :width="PLOT_W" :height="PLOT_H" />
        </clipPath>
      </defs>

      <!-- Horizontal grid lines -->
      <g>
        <line
          v-for="tick in yTicks"
          :key="tick.value"
          :x1="PAD.l" :y1="f(tick.y)"
          :x2="VB_W - PAD.r" :y2="f(tick.y)"
          stroke="#E5E7EB" stroke-width="1"
        />
      </g>

      <!-- Y-axis labels -->
      <text
        v-for="tick in yTicks"
        :key="`yl-${tick.value}`"
        :x="PAD.l - 8" :y="f(tick.y + 4)"
        text-anchor="end"
        font-size="11"
        fill="#9CA3AF"
        font-family="Inter, system-ui, sans-serif"
      >{{ tick.value }}</text>

      <!-- Area fill -->
      <path
        v-if="areaPath"
        :d="areaPath"
        :fill="`url(#lg-${uid})`"
        :clip-path="`url(#clip-${uid})`"
      />

      <!-- Line -->
      <path
        v-if="linePath"
        :d="linePath"
        :stroke="color"
        stroke-width="2.5"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        :clip-path="`url(#clip-${uid})`"
      />

      <!-- X-axis labels -->
      <text
        v-for="pt in xLabels"
        :key="`xl-${pt.label}`"
        :x="f(pt.x)"
        :y="PAD.t + PLOT_H + 24"
        text-anchor="middle"
        font-size="11"
        fill="#9CA3AF"
        font-family="Inter, system-ui, sans-serif"
      >{{ formatDateShort(pt.label) }}</text>
    </svg>
  </div>
</template>

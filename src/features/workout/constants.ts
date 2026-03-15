import type { BreakPreset } from './types'

const DEFAULT_TIMER_DURATION_SECONDS = 20 * 60
const DEFAULT_TARGET_SETS = 30

const MIN_TIMER_DURATION_SECONDS = 60
const MAX_TIMER_DURATION_SECONDS = 60 * 60
const TIMER_DURATION_STEP_SECONDS = 5 * 60

const MIN_TARGET_SETS = 1
const MAX_TARGET_SETS = 100
const TARGET_SET_STEP = 5

const BREAK_PRESETS: Array<BreakPreset> = [
  { label: 'QUICK', durationSeconds: 30, display: '0:30' },
  { label: 'MEDIUM', durationSeconds: 45, display: '0:45' },
  { label: 'NORMAL', durationSeconds: 60, display: '1:00' },
  { label: 'LONG', durationSeconds: 90, display: '1:30' },
  { label: 'EXTENDED', durationSeconds: 120, display: '2:00' },
]

export {
  BREAK_PRESETS,
  DEFAULT_TARGET_SETS,
  DEFAULT_TIMER_DURATION_SECONDS,
  MAX_TARGET_SETS,
  MAX_TIMER_DURATION_SECONDS,
  MIN_TARGET_SETS,
  MIN_TIMER_DURATION_SECONDS,
  TARGET_SET_STEP,
  TIMER_DURATION_STEP_SECONDS,
}

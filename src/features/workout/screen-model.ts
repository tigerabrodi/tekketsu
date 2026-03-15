import {
  BREAK_PRESETS,
  TARGET_SET_STEP,
  TIMER_DURATION_STEP_SECONDS,
} from './constants'
import { formatBreakSeconds, formatSeconds } from './formatters'
import {
  getCompletionStats,
  getMainDisplay,
  getWorkoutStatus,
  isConfigLocked,
} from './selectors'
import type {
  WorkoutMode,
  WorkoutScreenActions,
  WorkoutScreenModel,
  WorkoutState,
} from './types'

function createWorkoutScreenModel(state: WorkoutState): WorkoutScreenModel {
  const isTimerMode = state.mode === 'timer'
  const status = getWorkoutStatus(state)
  const activeBreakPreset =
    BREAK_PRESETS.find(
      (breakPreset) =>
        breakPreset.durationSeconds === state.activeBreakDurationSeconds
    ) ?? null
  const isBreakActive = state.breakTimeSeconds > 0
  const isComplete = status === 'complete'

  return {
    state,
    status,
    statusLabel: status === 'break' ? 'RUNNING' : status.toUpperCase(),
    isCompletionVisible: isComplete,
    mainDisplay: getMainDisplay(state),
    secondaryValue: isTimerMode
      ? state.completedSets.toString()
      : formatSeconds(state.currentTimeSeconds),
    secondaryLabel: isTimerMode ? 'SETS COMPLETED' : 'STOPWATCH',
    adjusterValue: isTimerMode
      ? Math.floor(state.timerDurationSeconds / 60).toString()
      : state.targetSets.toString(),
    adjusterUnitLabel: isTimerMode ? 'MINUTES' : 'SETS',
    isTimerMode,
    isTimerTabActive: state.mode === 'timer',
    isSetsTabActive: state.mode === 'sets',
    isConfigDisabled: isConfigLocked(state),
    isPrimaryControlDisabled: isBreakActive || isComplete,
    primaryControlIcon: state.isRunning && !isBreakActive ? 'pause' : 'play',
    isBreakActive,
    showBreakPresets: !isBreakActive,
    areBreakPresetsDisabled: !state.isRunning || isBreakActive || isComplete,
    breakCountdownDisplay: isBreakActive
      ? formatBreakSeconds(state.breakTimeSeconds)
      : null,
    breakSummaryLabel:
      isBreakActive && activeBreakPreset
        ? `${activeBreakPreset.label} - ${activeBreakPreset.display}`
        : null,
    breakPresets: BREAK_PRESETS,
    completionStats: getCompletionStats(state),
  }
}

function createWorkoutScreenActions<
  T extends {
    onChangeMode: (mode: WorkoutMode) => void
    onToggleRunning: () => void
    onReset: () => void
    onStartBreak: (durationSeconds: number) => void
    onSignOut: () => void
  },
>({
  onChangeMode,
  onToggleRunning,
  onReset,
  onStartBreak,
  onSignOut,
}: T): WorkoutScreenActions {
  return {
    onSelectTimerMode: () => onChangeMode('timer'),
    onSelectSetsMode: () => onChangeMode('sets'),
    onDecreaseConfig: () => undefined,
    onIncreaseConfig: () => undefined,
    onToggleRunning,
    onReset,
    onStartBreak,
    onSignOut,
  }
}

function withConfigActions(
  state: WorkoutState,
  actions: WorkoutScreenActions,
  handlers: {
    onAdjustTimerDuration: (deltaSeconds: number) => void
    onAdjustTargetSets: (deltaSets: number) => void
  }
): WorkoutScreenActions {
  if (state.mode === 'timer') {
    return {
      ...actions,
      onDecreaseConfig: () =>
        handlers.onAdjustTimerDuration(-TIMER_DURATION_STEP_SECONDS),
      onIncreaseConfig: () =>
        handlers.onAdjustTimerDuration(TIMER_DURATION_STEP_SECONDS),
    }
  }

  return {
    ...actions,
    onDecreaseConfig: () => handlers.onAdjustTargetSets(-TARGET_SET_STEP),
    onIncreaseConfig: () => handlers.onAdjustTargetSets(TARGET_SET_STEP),
  }
}

export {
  createWorkoutScreenActions,
  createWorkoutScreenModel,
  withConfigActions,
}

import {
  BREAK_PRESETS,
  TARGET_SET_STEP,
  TIMER_DURATION_STEP_SECONDS,
} from './constants'
import { formatSeconds } from './formatters'
import { getMainDisplay, getWorkoutStatus } from './selectors'
import type {
  WorkoutMode,
  WorkoutScreenActions,
  WorkoutScreenModel,
  WorkoutState,
} from './types'

function createWorkoutScreenModel(state: WorkoutState): WorkoutScreenModel {
  const isTimerMode = state.mode === 'timer'
  const status = getWorkoutStatus(state)

  return {
    state,
    status,
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
    breakPresets: BREAK_PRESETS,
  }
}

function createWorkoutScreenActions<
  T extends {
    onChangeMode: (mode: WorkoutMode) => void
    onSignOut: () => void
  },
>({ onChangeMode, onSignOut }: T): WorkoutScreenActions {
  return {
    onSelectTimerMode: () => onChangeMode('timer'),
    onSelectSetsMode: () => onChangeMode('sets'),
    onDecreaseConfig: () => undefined,
    onIncreaseConfig: () => undefined,
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

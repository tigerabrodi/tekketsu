import {
  DEFAULT_TARGET_SETS,
  DEFAULT_TIMER_DURATION_SECONDS,
  MAX_TARGET_SETS,
  MAX_TIMER_DURATION_SECONDS,
  MIN_TARGET_SETS,
  MIN_TIMER_DURATION_SECONDS,
} from './constants'
import { isConfigLocked } from './selectors'
import type { WorkoutAction, WorkoutState } from './types'

function createInitialWorkoutState(
  overrides: Partial<WorkoutState> = {}
): WorkoutState {
  const mode = overrides.mode ?? 'timer'
  const timerDurationSeconds =
    overrides.timerDurationSeconds ?? DEFAULT_TIMER_DURATION_SECONDS
  const targetSets = overrides.targetSets ?? DEFAULT_TARGET_SETS
  const currentTimeSeconds =
    overrides.currentTimeSeconds ??
    (mode === 'timer' ? timerDurationSeconds : 0)

  return {
    mode,
    timerDurationSeconds,
    targetSets,
    currentTimeSeconds,
    totalActiveTimeSeconds: overrides.totalActiveTimeSeconds ?? 0,
    completedSets: overrides.completedSets ?? 0,
    isRunning: overrides.isRunning ?? false,
    breakTimeSeconds: overrides.breakTimeSeconds ?? 0,
    activeBreakDurationSeconds: overrides.activeBreakDurationSeconds ?? 0,
    isComplete: overrides.isComplete ?? false,
  }
}

function clampNumber(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

function hasActiveBreak(state: WorkoutState): boolean {
  return state.breakTimeSeconds > 0
}

function resetWorkoutState(state: WorkoutState): WorkoutState {
  return createInitialWorkoutState({
    mode: state.mode,
    timerDurationSeconds: state.timerDurationSeconds,
    targetSets: state.targetSets,
  })
}

function completeWorkout(state: WorkoutState): WorkoutState {
  return {
    ...state,
    currentTimeSeconds: Math.max(0, state.currentTimeSeconds),
    isRunning: false,
    breakTimeSeconds: 0,
    activeBreakDurationSeconds: 0,
    isComplete: true,
  }
}

function tickTimerState(state: WorkoutState): WorkoutState {
  const nextTime = Math.max(0, state.currentTimeSeconds - 1)

  if (nextTime === 0) {
    return completeWorkout({
      ...state,
      currentTimeSeconds: 0,
    })
  }

  return {
    ...state,
    currentTimeSeconds: nextTime,
  }
}

function tickSetsState(state: WorkoutState): WorkoutState {
  return {
    ...state,
    currentTimeSeconds: state.currentTimeSeconds + 1,
    totalActiveTimeSeconds: state.totalActiveTimeSeconds + 1,
  }
}

function tickBreakState(state: WorkoutState): WorkoutState {
  const nextBreakTime = Math.max(0, state.breakTimeSeconds - 1)

  if (state.mode === 'timer') {
    const nextTime = Math.max(0, state.currentTimeSeconds - 1)

    if (nextTime === 0) {
      return completeWorkout({
        ...state,
        currentTimeSeconds: 0,
      })
    }

    if (nextBreakTime === 0) {
      return {
        ...state,
        currentTimeSeconds: nextTime,
        breakTimeSeconds: 0,
        activeBreakDurationSeconds: 0,
      }
    }

    return {
      ...state,
      currentTimeSeconds: nextTime,
      breakTimeSeconds: nextBreakTime,
    }
  }

  if (nextBreakTime === 0) {
    return {
      ...state,
      breakTimeSeconds: 0,
      activeBreakDurationSeconds: 0,
    }
  }

  return {
    ...state,
    breakTimeSeconds: nextBreakTime,
  }
}

function workoutReducer(
  state: WorkoutState,
  action: WorkoutAction
): WorkoutState {
  switch (action.type) {
    case 'setMode':
      return createInitialWorkoutState({
        mode: action.mode,
      })

    case 'toggleRunning':
      if (state.isComplete || hasActiveBreak(state)) {
        return state
      }

      return {
        ...state,
        isRunning: !state.isRunning,
      }

    case 'resetWorkout':
      return resetWorkoutState(state)

    case 'tickSecond':
      if (state.isComplete) {
        return state
      }

      if (hasActiveBreak(state)) {
        return tickBreakState(state)
      }

      if (!state.isRunning) {
        return state
      }

      if (state.mode === 'timer') {
        return tickTimerState(state)
      }

      return tickSetsState(state)

    case 'startBreak':
      if (
        state.isComplete ||
        !state.isRunning ||
        hasActiveBreak(state) ||
        action.durationSeconds <= 0
      ) {
        return state
      }

      if (
        state.mode === 'sets' &&
        state.completedSets + 1 >= state.targetSets
      ) {
        return completeWorkout({
          ...state,
          completedSets: state.completedSets + 1,
          currentTimeSeconds: 0,
        })
      }

      return {
        ...state,
        completedSets: state.completedSets + 1,
        currentTimeSeconds:
          state.mode === 'sets' ? 0 : state.currentTimeSeconds,
        breakTimeSeconds: action.durationSeconds,
        activeBreakDurationSeconds: action.durationSeconds,
      }

    case 'adjustTimerDuration':
      if (state.mode !== 'timer' || isConfigLocked(state)) {
        return state
      }

      return {
        ...state,
        timerDurationSeconds: clampNumber(
          state.timerDurationSeconds + action.deltaSeconds,
          MIN_TIMER_DURATION_SECONDS,
          MAX_TIMER_DURATION_SECONDS
        ),
        currentTimeSeconds: clampNumber(
          state.timerDurationSeconds + action.deltaSeconds,
          MIN_TIMER_DURATION_SECONDS,
          MAX_TIMER_DURATION_SECONDS
        ),
      }

    case 'adjustTargetSets':
      if (state.mode !== 'sets' || isConfigLocked(state)) {
        return state
      }

      return {
        ...state,
        targetSets: clampNumber(
          state.targetSets + action.deltaSets,
          MIN_TARGET_SETS,
          MAX_TARGET_SETS
        ),
      }
  }
}

export { createInitialWorkoutState, workoutReducer }

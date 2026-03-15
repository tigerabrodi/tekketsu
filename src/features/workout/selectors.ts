import { formatSeconds } from './formatters'
import type { CompletionStat, WorkoutState, WorkoutStatus } from './types'

function hasActiveBreak(state: WorkoutState): boolean {
  return state.breakTimeSeconds > 0
}

function isFreshWorkout(state: WorkoutState): boolean {
  if (state.isRunning || state.isComplete) {
    return false
  }

  if (state.completedSets !== 0 || state.totalActiveTimeSeconds !== 0) {
    return false
  }

  if (hasActiveBreak(state) || state.activeBreakDurationSeconds !== 0) {
    return false
  }

  if (state.mode === 'timer') {
    return state.currentTimeSeconds === state.timerDurationSeconds
  }

  return state.currentTimeSeconds === 0
}

function getWorkoutStatus(state: WorkoutState): WorkoutStatus {
  if (state.isComplete) {
    return 'complete'
  }

  if (hasActiveBreak(state)) {
    return 'break'
  }

  if (state.isRunning) {
    return 'running'
  }

  if (isFreshWorkout(state)) {
    return 'ready'
  }

  return 'paused'
}

function isConfigLocked(state: WorkoutState): boolean {
  return getWorkoutStatus(state) !== 'ready'
}

function getRemainingSets(state: WorkoutState): number {
  return Math.max(0, state.targetSets - state.completedSets)
}

function getMainDisplay(state: WorkoutState): string {
  if (state.mode === 'timer') {
    return formatSeconds(state.currentTimeSeconds)
  }

  return `${getRemainingSets(state)} / ${state.targetSets}`
}

function getCompletionStats(state: WorkoutState): Array<CompletionStat> {
  if (state.mode === 'timer') {
    return [
      {
        label: 'SETS COMPLETED',
        value: state.completedSets.toString(),
        tone: 'accent',
      },
      {
        label: 'DURATION',
        value: formatSeconds(state.timerDurationSeconds),
        tone: 'default',
      },
    ]
  }

  return [
    {
      label: 'SETS COMPLETED',
      value: state.completedSets.toString(),
      tone: 'accent',
    },
    {
      label: 'ACTIVE TIME',
      value: formatSeconds(state.totalActiveTimeSeconds),
      tone: 'default',
    },
  ]
}

export {
  getCompletionStats,
  getMainDisplay,
  getRemainingSets,
  getWorkoutStatus,
  isConfigLocked,
  isFreshWorkout,
}

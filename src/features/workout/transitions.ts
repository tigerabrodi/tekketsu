import type { WorkoutState } from './types'

function didBreakFinishNaturally(
  previousState: WorkoutState,
  nextState: WorkoutState
): boolean {
  return (
    previousState.breakTimeSeconds > 0 &&
    nextState.breakTimeSeconds === 0 &&
    nextState.isRunning &&
    !nextState.isComplete
  )
}

export { didBreakFinishNaturally }

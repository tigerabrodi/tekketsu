import { useAuthActions } from '@convex-dev/auth/react'
import { useEffect, useReducer } from 'react'
import { createInitialWorkoutState, workoutReducer } from './reducer'
import {
  createWorkoutScreenActions,
  createWorkoutScreenModel,
  withConfigActions,
} from './screen-model'
import { isConfigLocked } from './selectors'
import type { WorkoutMode } from './types'

function useWorkoutScreen() {
  const [state, dispatch] = useReducer(
    workoutReducer,
    undefined,
    createInitialWorkoutState
  )
  const { signOut } = useAuthActions()

  const handleChangeMode = (mode: WorkoutMode) => {
    if (state.mode === mode || isConfigLocked(state)) {
      return
    }

    dispatch({ type: 'setMode', mode })
  }

  const handleAdjustTimerDuration = (deltaSeconds: number) => {
    dispatch({ type: 'adjustTimerDuration', deltaSeconds })
  }

  const handleAdjustTargetSets = (deltaSets: number) => {
    dispatch({ type: 'adjustTargetSets', deltaSets })
  }

  const handleToggleRunning = () => {
    dispatch({ type: 'toggleRunning' })
  }

  const handleReset = () => {
    dispatch({ type: 'resetWorkout' })
  }

  const handleStartBreak = (durationSeconds: number) => {
    dispatch({ type: 'startBreak', durationSeconds })
  }

  const shouldTick =
    !state.isComplete && (state.isRunning || state.breakTimeSeconds > 0)

  useEffect(() => {
    if (!shouldTick) {
      return undefined
    }

    const intervalId = window.setInterval(() => {
      dispatch({ type: 'tickSecond' })
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [shouldTick])

  const model = createWorkoutScreenModel(state)
  const actions = withConfigActions(
    state,
    createWorkoutScreenActions({
      onChangeMode: handleChangeMode,
      onToggleRunning: handleToggleRunning,
      onReset: handleReset,
      onStartBreak: handleStartBreak,
      onSignOut: () => {
        void signOut()
      },
    }),
    {
      onAdjustTimerDuration: handleAdjustTimerDuration,
      onAdjustTargetSets: handleAdjustTargetSets,
    }
  )

  return { model, actions }
}

export { useWorkoutScreen }

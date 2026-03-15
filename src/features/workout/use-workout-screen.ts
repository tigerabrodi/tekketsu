import { useAuthActions } from '@convex-dev/auth/react'
import { clearCachedUser } from '@/lib/current-user-session'
import { notificationManager } from '@/managers/notification'
import { soundEffectManager } from '@/managers/sound-effect'
import { useEffect, useReducer, useRef } from 'react'
import { createInitialWorkoutState, workoutReducer } from './reducer'
import {
  createWorkoutScreenActions,
  createWorkoutScreenModel,
  withConfigActions,
} from './screen-model'
import { isConfigLocked } from './selectors'
import { didBreakFinishNaturally } from './transitions'
import type { WorkoutMode } from './types'

function useWorkoutScreen() {
  const [state, dispatch] = useReducer(
    workoutReducer,
    undefined,
    createInitialWorkoutState
  )
  const { signOut } = useAuthActions()
  const previousStateRef = useRef(state)

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

  useEffect(() => {
    const previousState = previousStateRef.current

    if (didBreakFinishNaturally(previousState, state)) {
      void soundEffectManager.playBreakFinished()
      void notificationManager.notifyBreakFinished()
    }

    previousStateRef.current = state
  }, [state])

  const model = createWorkoutScreenModel(state)
  const actions = withConfigActions(
    state,
    createWorkoutScreenActions({
      onChangeMode: handleChangeMode,
      onToggleRunning: handleToggleRunning,
      onReset: handleReset,
      onStartBreak: handleStartBreak,
      onSignOut: () => {
        clearCachedUser()
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

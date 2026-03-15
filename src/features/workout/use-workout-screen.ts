import { useAuthActions } from '@convex-dev/auth/react'
import { useReducer } from 'react'
import { createInitialWorkoutState, workoutReducer } from './reducer'
import {
  createWorkoutScreenActions,
  createWorkoutScreenModel,
  withConfigActions,
} from './screen-model'
import type { WorkoutMode } from './types'

function useWorkoutScreen() {
  const [state, dispatch] = useReducer(
    workoutReducer,
    undefined,
    createInitialWorkoutState
  )
  const { signOut } = useAuthActions()

  const handleChangeMode = (mode: WorkoutMode) => {
    if (state.mode === mode) {
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

  const model = createWorkoutScreenModel(state)
  const actions = withConfigActions(
    state,
    createWorkoutScreenActions({
      onChangeMode: handleChangeMode,
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

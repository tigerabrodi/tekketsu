import { WorkoutScreen } from './components/workout-screen'
import { useWorkoutScreen } from './use-workout-screen'

function WorkoutScreenFeature() {
  const { model, actions } = useWorkoutScreen()

  return <WorkoutScreen model={model} actions={actions} />
}

export { WorkoutScreenFeature }

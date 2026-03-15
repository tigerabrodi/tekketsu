import { WorkoutScreenFeature } from '@/features/workout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/workout')({
  component: WorkoutPage,
})

function WorkoutPage() {
  return <WorkoutScreenFeature />
}

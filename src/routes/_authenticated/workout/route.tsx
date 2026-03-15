import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/workout')({
  component: WorkoutPage,
})

function WorkoutPage() {
  return (
    <div className="bg-bg flex min-h-screen items-center justify-center">
      <p className="font-mono text-text-primary text-body">Hello world</p>
    </div>
  )
}

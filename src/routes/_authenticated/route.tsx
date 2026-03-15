import { CurrentUserProvider } from '@/lib/current-user-provider'
import { api } from '@convex/_generated/api'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { useQuery } from 'convex/react'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedRoute,
})

function AuthenticatedRoute() {
  const currentUser = useQuery(api.users.queries.getCurrentUser)

  if (currentUser === undefined) {
    return null
  }

  if (currentUser === null) {
    return <Navigate to="/" />
  }

  return (
    <CurrentUserProvider user={currentUser}>
      <Outlet />
    </CurrentUserProvider>
  )
}

import { AuthenticatedAppRuntime } from '@/components/authenticated-app-runtime'
import { CurrentUserProvider } from '@/lib/current-user-provider'
import { useEffectiveCurrentUser } from '@/lib/use-effective-current-user'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedRoute,
})

function AuthenticatedRoute() {
  const { currentUser, effectiveUser } = useEffectiveCurrentUser()
  const resolvedUser = effectiveUser ?? currentUser

  if (currentUser === undefined && effectiveUser === null) {
    return null
  }

  if (currentUser === null && effectiveUser === null) {
    return <Navigate to="/" />
  }

  if (!resolvedUser) {
    return null
  }

  return (
    <CurrentUserProvider user={resolvedUser}>
      <AuthenticatedAppRuntime />
      <Outlet />
    </CurrentUserProvider>
  )
}

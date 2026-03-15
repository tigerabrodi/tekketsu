import { PwaUpdatePrompt } from '@/components/pwa-update-prompt'
import { LoadingScreen } from '@/components/loading-screen'
import { shouldRedirectAuthenticatedHome } from '@/lib/current-user-session'
import { useEffectiveCurrentUser } from '@/lib/use-effective-current-user'
import {
  createRootRoute,
  Navigate,
  Outlet,
  useLocation,
} from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { effectiveUser, shouldShowLoading } = useEffectiveCurrentUser()
  const pathname = useLocation({ select: (location) => location.pathname })

  if (shouldShowLoading) {
    return <LoadingScreen />
  }

  if (
    shouldRedirectAuthenticatedHome({
      pathname,
      effectiveUser,
    })
  ) {
    return <Navigate to="/workout" />
  }

  return (
    <>
      <Outlet />
      <PwaUpdatePrompt />
    </>
  )
}

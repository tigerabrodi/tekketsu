import { LoadingScreen } from '@/components/loading-screen'
import { api } from '@convex/_generated/api'
import {
  createRootRoute,
  Navigate,
  Outlet,
  useLocation,
} from '@tanstack/react-router'
import { useConvexAuth, useQuery } from 'convex/react'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { isLoading: isAuthLoading } = useConvexAuth()
  const currentUser = useQuery(api.users.queries.getCurrentUser)
  const pathname = useLocation({ select: (location) => location.pathname })

  if (isAuthLoading || currentUser === undefined) {
    return <LoadingScreen />
  }

  // Redirect authenticated users to the workout screen
  if (currentUser && pathname === '/') {
    return <Navigate to="/workout" />
  }

  return <Outlet />
}

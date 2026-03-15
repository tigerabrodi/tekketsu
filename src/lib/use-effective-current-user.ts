import { api } from '@convex/_generated/api'
import { useConvexAuth, useQuery } from 'convex/react'
import { useEffect } from 'react'
import {
  clearCachedUser,
  readCachedUser,
  resolveEffectiveCurrentUser,
  shouldShowCurrentUserLoading,
  writeCachedUser,
} from './current-user-session'
import { useIsOnline } from './use-is-online'

function useEffectiveCurrentUser() {
  const { isLoading: isAuthLoading } = useConvexAuth()
  const currentUser = useQuery(api.users.queries.getCurrentUser)
  const isOnline = useIsOnline()
  const cachedUser = readCachedUser()

  useEffect(() => {
    if (currentUser) {
      writeCachedUser(currentUser)
      return
    }

    if (currentUser === null) {
      clearCachedUser()
    }
  }, [currentUser])

  const effectiveUser = resolveEffectiveCurrentUser({
    currentUser,
    cachedUser,
    isOnline,
  })

  const shouldShowLoading = shouldShowCurrentUserLoading({
    currentUser,
    isAuthLoading,
    isOnline,
  })

  return {
    cachedUser,
    currentUser,
    effectiveUser,
    isOnline,
    shouldShowLoading,
  }
}

export { useEffectiveCurrentUser }

import type { Doc } from '@convex/_generated/dataModel'
import { createContext, useContext } from 'react'

const CurrentUserContext = createContext<Doc<'users'> | null>(null)

function useCurrentUser() {
  const currentUser = useContext(CurrentUserContext)

  if (!currentUser) {
    throw new Error('useCurrentUser must be used within CurrentUserProvider')
  }

  return currentUser
}

export { CurrentUserContext, useCurrentUser }

import { createContext, useContext } from 'react'
import type { CurrentUserLike } from './current-user-session'

const CurrentUserContext = createContext<CurrentUserLike | null>(null)

function useCurrentUser() {
  const currentUser = useContext(CurrentUserContext)

  if (!currentUser) {
    throw new Error('useCurrentUser must be used within CurrentUserProvider')
  }

  return currentUser
}

export { CurrentUserContext, useCurrentUser }

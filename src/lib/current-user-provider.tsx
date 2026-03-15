import type { ReactNode } from 'react'
import type { CurrentUserLike } from './current-user-session'
import { CurrentUserContext } from './current-user-context'

function CurrentUserProvider({
  user,
  children,
}: {
  user: CurrentUserLike
  children: ReactNode
}) {
  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export { CurrentUserProvider }

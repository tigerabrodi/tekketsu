import type { Doc } from '@convex/_generated/dataModel'
import type { ReactNode } from 'react'
import { CurrentUserContext } from './current-user-context'

function CurrentUserProvider({
  user,
  children,
}: {
  user: Doc<'users'>
  children: ReactNode
}) {
  return (
    <CurrentUserContext.Provider value={user}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export { CurrentUserProvider }

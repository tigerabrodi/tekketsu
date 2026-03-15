import type { Doc } from '@convex/_generated/dataModel'

const CACHED_USER_STORAGE_KEY = 'tekketsu:last-known-user'

type CachedUserSnapshot = Pick<Doc<'users'>, '_id' | 'name' | 'email' | 'image'>
type CurrentUserLike = Doc<'users'> | CachedUserSnapshot
type CurrentUserQueryResult = Doc<'users'> | null | undefined

function isCachedUserSnapshot(value: unknown): value is CachedUserSnapshot {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate._id === 'string' &&
    (typeof candidate.name === 'string' || candidate.name === undefined) &&
    (typeof candidate.email === 'string' || candidate.email === undefined) &&
    (typeof candidate.image === 'string' || candidate.image === undefined)
  )
}

function getBrowserStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage
}

function toCachedUserSnapshot(user: CurrentUserLike): CachedUserSnapshot {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
  }
}

function readCachedUser(
  storage: Storage | null = getBrowserStorage()
): CachedUserSnapshot | null {
  if (!storage) {
    return null
  }

  const rawValue = storage.getItem(CACHED_USER_STORAGE_KEY)

  if (!rawValue) {
    return null
  }

  try {
    const parsedValue = JSON.parse(rawValue) as unknown
    return isCachedUserSnapshot(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

function writeCachedUser(
  user: CurrentUserLike,
  storage: Storage | null = getBrowserStorage()
): CachedUserSnapshot {
  const snapshot = toCachedUserSnapshot(user)

  storage?.setItem(CACHED_USER_STORAGE_KEY, JSON.stringify(snapshot))

  return snapshot
}

function clearCachedUser(storage: Storage | null = getBrowserStorage()): void {
  storage?.removeItem(CACHED_USER_STORAGE_KEY)
}

function resolveEffectiveCurrentUser({
  currentUser,
  cachedUser,
  isOnline,
}: {
  currentUser: CurrentUserQueryResult
  cachedUser: CachedUserSnapshot | null
  isOnline: boolean
}): CurrentUserLike | null {
  if (currentUser) {
    return currentUser
  }

  if (!isOnline && cachedUser) {
    return cachedUser
  }

  return null
}

function shouldShowCurrentUserLoading({
  currentUser,
  isAuthLoading,
  isOnline,
}: {
  currentUser: CurrentUserQueryResult
  isAuthLoading: boolean
  isOnline: boolean
}): boolean {
  return isOnline && (isAuthLoading || currentUser === undefined)
}

function shouldRedirectAuthenticatedHome({
  pathname,
  effectiveUser,
}: {
  pathname: string
  effectiveUser: CurrentUserLike | null
}): boolean {
  return pathname === '/' && effectiveUser !== null
}

export {
  CACHED_USER_STORAGE_KEY,
  clearCachedUser,
  readCachedUser,
  resolveEffectiveCurrentUser,
  shouldRedirectAuthenticatedHome,
  shouldShowCurrentUserLoading,
  writeCachedUser,
}

export type { CachedUserSnapshot, CurrentUserLike, CurrentUserQueryResult }

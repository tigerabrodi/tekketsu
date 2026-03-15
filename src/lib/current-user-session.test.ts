/** @vitest-environment jsdom */

import { describe, expect, it } from 'vitest'
import type { Doc, Id } from '@convex/_generated/dataModel'
import {
  CACHED_USER_STORAGE_KEY,
  type CachedUserSnapshot,
  clearCachedUser,
  readCachedUser,
  resolveEffectiveCurrentUser,
  shouldRedirectAuthenticatedHome,
  shouldShowCurrentUserLoading,
  writeCachedUser,
} from './current-user-session'

const cachedUser: CachedUserSnapshot = {
  _id: 'users:123' as Id<'users'>,
  name: 'Guts',
  email: 'guts@example.com',
  image: 'https://example.com/guts.png',
}

const liveUser: Doc<'users'> = {
  ...cachedUser,
  _creationTime: 1,
  isAdmin: true,
}

describe('cached user storage', () => {
  it('writes and reads a cached user snapshot', () => {
    writeCachedUser(cachedUser)

    expect(readCachedUser()).toEqual(cachedUser)
  })

  it('clears the cached user snapshot', () => {
    writeCachedUser(cachedUser)
    clearCachedUser()

    expect(readCachedUser()).toBeNull()
  })

  it('returns null for invalid cached payloads', () => {
    window.localStorage.setItem(CACHED_USER_STORAGE_KEY, '{"bad":true}')

    expect(readCachedUser()).toBeNull()
  })
})

describe('current user session resolution', () => {
  it('prefers the live current user over the cached snapshot', () => {
    expect(
      resolveEffectiveCurrentUser({
        currentUser: liveUser,
        cachedUser,
        isOnline: true,
      })
    ).toMatchObject({
      ...liveUser,
      isAdmin: true,
    })
  })

  it('uses the cached user only when offline', () => {
    expect(
      resolveEffectiveCurrentUser({
        currentUser: undefined,
        cachedUser,
        isOnline: false,
      })
    ).toEqual(cachedUser)

    expect(
      resolveEffectiveCurrentUser({
        currentUser: undefined,
        cachedUser,
        isOnline: true,
      })
    ).toBeNull()
  })

  it('shows loading only while online auth state is unresolved', () => {
    expect(
      shouldShowCurrentUserLoading({
        currentUser: undefined,
        isAuthLoading: true,
        isOnline: true,
      })
    ).toBe(true)

    expect(
      shouldShowCurrentUserLoading({
        currentUser: undefined,
        isAuthLoading: true,
        isOnline: false,
      })
    ).toBe(false)
  })

  it('redirects authenticated home requests to the workout screen', () => {
    expect(
      shouldRedirectAuthenticatedHome({
        pathname: '/',
        effectiveUser: cachedUser,
      })
    ).toBe(true)

    expect(
      shouldRedirectAuthenticatedHome({
        pathname: '/workout',
        effectiveUser: cachedUser,
      })
    ).toBe(false)
  })
})

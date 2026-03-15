/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  BREAK_FINISHED_NOTIFICATION_ICON,
  BREAK_FINISHED_NOTIFICATION_TAG,
  NotificationManager,
} from './notification'

describe('NotificationManager', () => {
  let notificationApi: {
    permission: NotificationPermission
    requestPermission: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    notificationApi = {
      permission: 'default',
      requestPermission: vi.fn().mockResolvedValue('granted'),
    }

    Object.defineProperty(globalThis, 'Notification', {
      configurable: true,
      value: notificationApi,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requests notification permission when supported', async () => {
    const manager = new NotificationManager()

    await expect(manager.requestPermission()).resolves.toBe('granted')
    expect(notificationApi.requestPermission).toHaveBeenCalledTimes(1)
  })

  it('returns unsupported when the Notification API is unavailable', async () => {
    Object.defineProperty(globalThis, 'Notification', {
      configurable: true,
      value: undefined,
    })

    await expect(new NotificationManager().requestPermission()).resolves.toBe(
      'unsupported'
    )
  })

  it('returns false when notification permission is denied', async () => {
    Object.defineProperty(globalThis, 'Notification', {
      configurable: true,
      value: {
        permission: 'denied',
        requestPermission: vi.fn(),
      },
    })

    await expect(new NotificationManager().notifyBreakFinished()).resolves.toBe(
      false
    )
  })

  it('shows the break finished notification through the active service worker', async () => {
    const showNotification = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(globalThis, 'Notification', {
      configurable: true,
      value: {
        permission: 'granted',
        requestPermission: vi.fn(),
      },
    })

    Object.defineProperty(window.navigator, 'serviceWorker', {
      configurable: true,
      value: {
        ready: Promise.resolve({
          showNotification,
        }),
      },
    })

    await expect(new NotificationManager().notifyBreakFinished()).resolves.toBe(
      true
    )

    expect(showNotification).toHaveBeenCalledWith('Break Over', {
      body: 'Time to get back to work',
      data: { path: '/workout' },
      icon: BREAK_FINISHED_NOTIFICATION_ICON,
      renotify: true,
      tag: BREAK_FINISHED_NOTIFICATION_TAG,
    })
  })
})

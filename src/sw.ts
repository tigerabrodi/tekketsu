/// <reference lib="WebWorker" />

import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

type SkipWaitingMessage = {
  type: 'SKIP_WAITING'
}

function isSkipWaitingMessage(value: unknown): value is SkipWaitingMessage {
  return (
    !!value &&
    typeof value === 'object' &&
    'type' in value &&
    value.type === 'SKIP_WAITING'
  )
}

function getNotificationPath(data: unknown): string {
  if (!data || typeof data !== 'object' || !('path' in data)) {
    return '/workout'
  }

  return typeof data.path === 'string' ? data.path : '/workout'
}

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

registerRoute(new NavigationRoute(createHandlerBoundToURL('/index.html')))

self.addEventListener('message', (event) => {
  if (isSkipWaitingMessage(event.data)) {
    void self.skipWaiting()
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  event.waitUntil(
    (async () => {
      const notificationPath = getNotificationPath(event.notification.data)
      const targetUrl = new URL(notificationPath, self.location.origin).href
      const windowClients = await self.clients.matchAll({
        includeUncontrolled: true,
        type: 'window',
      })
      const matchingClient =
        windowClients.find((windowClient) => 'focus' in windowClient) ?? null

      if (matchingClient && 'focus' in matchingClient) {
        await matchingClient.focus()

        if ('navigate' in matchingClient) {
          await matchingClient.navigate(targetUrl)
        }

        return
      }

      await self.clients.openWindow(targetUrl)
    })()
  )
})

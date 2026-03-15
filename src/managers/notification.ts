const BREAK_FINISHED_NOTIFICATION_TAG = 'break-finished'
const BREAK_FINISHED_NOTIFICATION_ICON = '/pwa/icon-192.png'

class NotificationManager {
  async requestPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (typeof Notification === 'undefined') {
      return 'unsupported'
    }

    if (Notification.permission !== 'default') {
      return Notification.permission
    }

    try {
      return await Notification.requestPermission()
    } catch {
      return 'denied'
    }
  }

  async notifyBreakFinished(): Promise<boolean> {
    if (
      typeof Notification === 'undefined' ||
      Notification.permission !== 'granted' ||
      !('serviceWorker' in navigator)
    ) {
      return false
    }

    const registration = await navigator.serviceWorker.ready
    const notificationOptions: NotificationOptions & { renotify: boolean } = {
      body: 'Time to get back to work',
      data: { path: '/workout' },
      icon: BREAK_FINISHED_NOTIFICATION_ICON,
      renotify: true,
      tag: BREAK_FINISHED_NOTIFICATION_TAG,
    }

    await registration.showNotification('Break Over', notificationOptions)

    return true
  }
}

const notificationManager = new NotificationManager()

export {
  BREAK_FINISHED_NOTIFICATION_ICON,
  BREAK_FINISHED_NOTIFICATION_TAG,
  NotificationManager,
  notificationManager,
}

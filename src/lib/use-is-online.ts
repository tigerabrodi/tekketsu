import { useEffect, useState } from 'react'

function getInitialOnlineState(): boolean {
  if (typeof navigator === 'undefined') {
    return true
  }

  return navigator.onLine
}

function useIsOnline(): boolean {
  const [isOnline, setIsOnline] = useState(getInitialOnlineState)

  useEffect(() => {
    const handleGoOnline = () => setIsOnline(true)
    const handleGoOffline = () => setIsOnline(false)

    window.addEventListener('online', handleGoOnline)
    window.addEventListener('offline', handleGoOffline)

    return () => {
      window.removeEventListener('online', handleGoOnline)
      window.removeEventListener('offline', handleGoOffline)
    }
  }, [])

  return isOnline
}

export { useIsOnline }

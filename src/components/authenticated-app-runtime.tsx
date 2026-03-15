import { notificationManager } from '@/managers/notification'
import { soundEffectManager } from '@/managers/sound-effect'
import { useEffect } from 'react'

function AuthenticatedAppRuntime() {
  useEffect(() => {
    soundEffectManager.prime()
    void notificationManager.requestPermission()
  }, [])

  return null
}

export { AuthenticatedAppRuntime }

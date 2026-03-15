import breakFinishedUrl from '@/assets/break-finished.mp3'

class SoundEffectManager {
  private breakFinishedAudio: HTMLAudioElement | null = null

  private getBreakFinishedAudio(): HTMLAudioElement {
    if (!this.breakFinishedAudio) {
      const audio = new Audio(breakFinishedUrl)
      audio.preload = 'auto'
      this.breakFinishedAudio = audio
    }

    return this.breakFinishedAudio
  }

  prime(): void {
    this.getBreakFinishedAudio().load()
  }

  async playBreakFinished(): Promise<void> {
    const audio = this.getBreakFinishedAudio()
    audio.currentTime = 0

    try {
      await audio.play()
    } catch (error) {
      console.error('Failed to play break finished sound effect.', error)
    }
  }
}

const soundEffectManager = new SoundEffectManager()

export { SoundEffectManager, soundEffectManager }

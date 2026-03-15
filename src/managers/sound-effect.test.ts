/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SoundEffectManager } from './sound-effect'

type MockAudioElement = {
  currentTime: number
  load: ReturnType<typeof vi.fn>
  play: ReturnType<typeof vi.fn>
  preload: string
}

describe('SoundEffectManager', () => {
  let createdAudioElements: Array<MockAudioElement>

  beforeEach(() => {
    createdAudioElements = []

    function MockAudio() {
      const audio = {
        currentTime: 8,
        load: vi.fn(),
        play: vi.fn().mockResolvedValue(undefined),
        preload: '',
      }

      createdAudioElements.push(audio)

      return audio
    }

    vi.stubGlobal('Audio', MockAudio)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('primes the shared audio element', () => {
    const manager = new SoundEffectManager()

    manager.prime()

    expect(createdAudioElements).toHaveLength(1)
    expect(createdAudioElements[0]?.load).toHaveBeenCalledTimes(1)
  })

  it('resets currentTime before playing the break finished sound', async () => {
    const manager = new SoundEffectManager()

    await manager.playBreakFinished()

    expect(createdAudioElements[0]?.currentTime).toBe(0)
    expect(createdAudioElements[0]?.play).toHaveBeenCalledTimes(1)
  })

  it('swallows autoplay failures and logs them', async () => {
    const manager = new SoundEffectManager()
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)

    createdAudioElements = [
      {
        currentTime: 4,
        load: vi.fn(),
        play: vi.fn().mockRejectedValue(new Error('autoplay blocked')),
        preload: '',
      },
    ]

    function MockRejectedAudio() {
      return createdAudioElements[0] as unknown as HTMLAudioElement
    }

    vi.stubGlobal('Audio', MockRejectedAudio)

    await manager.playBreakFinished()

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
  })
})

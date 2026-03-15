/** @vitest-environment jsdom */

import { act, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const hookMocks = vi.hoisted(() => ({
  notifyBreakFinished: vi.fn().mockResolvedValue(true),
  playBreakFinished: vi.fn().mockResolvedValue(undefined),
  signOut: vi.fn(),
}))

vi.mock('@convex-dev/auth/react', () => ({
  useAuthActions: () => ({
    signOut: hookMocks.signOut,
  }),
}))

vi.mock('@/managers/sound-effect', () => ({
  soundEffectManager: {
    playBreakFinished: hookMocks.playBreakFinished,
    prime: vi.fn(),
  },
}))

vi.mock('@/managers/notification', () => ({
  notificationManager: {
    notifyBreakFinished: hookMocks.notifyBreakFinished,
    requestPermission: vi.fn(),
  },
}))

import { useWorkoutScreen } from './use-workout-screen'

type WorkoutScreenHookValue = ReturnType<typeof useWorkoutScreen>

const latestHookValueRef: { current: WorkoutScreenHookValue | null } = {
  current: null,
}

function TestHarness() {
  const hookValue = useWorkoutScreen()

  useEffect(() => {
    latestHookValueRef.current = hookValue
  }, [hookValue])

  return null
}

describe('useWorkoutScreen break completion cues', () => {
  let container: HTMLDivElement
  let root: ReactDOM.Root

  beforeEach(() => {
    vi.useFakeTimers()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = ReactDOM.createRoot(container)

    act(() => {
      root.render(<TestHarness />)
    })
  })

  afterEach(() => {
    act(() => {
      root.unmount()
    })

    container.remove()
    latestHookValueRef.current = null
    hookMocks.playBreakFinished.mockClear()
    hookMocks.notifyBreakFinished.mockClear()
    hookMocks.signOut.mockClear()
    vi.useRealTimers()
  })

  it('fires break completion cues once when a break ends naturally', () => {
    act(() => {
      latestHookValueRef.current?.actions.onToggleRunning()
      latestHookValueRef.current?.actions.onStartBreak(1)
    })

    act(() => {
      vi.advanceTimersByTime(6000)
    })

    expect(hookMocks.playBreakFinished).toHaveBeenCalledTimes(1)
    expect(hookMocks.notifyBreakFinished).toHaveBeenCalledTimes(1)
  })

  it('does not fire cues when reset clears an active break', () => {
    act(() => {
      latestHookValueRef.current?.actions.onToggleRunning()
      latestHookValueRef.current?.actions.onStartBreak(30)
      latestHookValueRef.current?.actions.onReset()
    })

    expect(hookMocks.playBreakFinished).not.toHaveBeenCalled()
    expect(hookMocks.notifyBreakFinished).not.toHaveBeenCalled()
  })

  it('does not fire cues when timer completion interrupts the break', () => {
    act(() => {
      latestHookValueRef.current?.actions.onDecreaseConfig()
      latestHookValueRef.current?.actions.onDecreaseConfig()
      latestHookValueRef.current?.actions.onDecreaseConfig()
      latestHookValueRef.current?.actions.onDecreaseConfig()
      latestHookValueRef.current?.actions.onToggleRunning()
      latestHookValueRef.current?.actions.onStartBreak(120)
    })

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    expect(hookMocks.playBreakFinished).not.toHaveBeenCalled()
    expect(hookMocks.notifyBreakFinished).not.toHaveBeenCalled()
  })
})

import { describe, expect, it } from 'vitest'
import { createInitialWorkoutState } from './reducer'
import { didBreakFinishNaturally } from './transitions'

describe('didBreakFinishNaturally', () => {
  it('returns true when a break countdown reaches zero without completing the workout', () => {
    expect(
      didBreakFinishNaturally(
        createInitialWorkoutState({
          isRunning: true,
          breakTimeSeconds: 1,
          activeBreakDurationSeconds: 30,
        }),
        createInitialWorkoutState({
          isRunning: true,
          breakTimeSeconds: 0,
          activeBreakDurationSeconds: 0,
        })
      )
    ).toBe(true)
  })

  it('returns false when a reset clears the break', () => {
    expect(
      didBreakFinishNaturally(
        createInitialWorkoutState({
          isRunning: true,
          breakTimeSeconds: 30,
          activeBreakDurationSeconds: 30,
        }),
        createInitialWorkoutState()
      )
    ).toBe(false)
  })

  it('returns false when timer completion interrupts the break', () => {
    expect(
      didBreakFinishNaturally(
        createInitialWorkoutState({
          isRunning: true,
          breakTimeSeconds: 60,
          activeBreakDurationSeconds: 120,
        }),
        createInitialWorkoutState({
          currentTimeSeconds: 0,
          isComplete: true,
        })
      )
    ).toBe(false)
  })
})

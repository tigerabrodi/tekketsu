import { describe, expect, it } from 'vitest'
import {
  getCompletionStats,
  getMainDisplay,
  getRemainingSets,
  getWorkoutStatus,
  isConfigLocked,
  isFreshWorkout,
} from './selectors'
import { createInitialWorkoutState } from './reducer'
import type { WorkoutState } from './types'

function createTimerState(overrides: Partial<WorkoutState> = {}): WorkoutState {
  return {
    ...createInitialWorkoutState(),
    ...overrides,
  }
}

function createSetsState(overrides: Partial<WorkoutState> = {}): WorkoutState {
  return {
    ...createInitialWorkoutState({ mode: 'sets' }),
    ...overrides,
  }
}

describe('getWorkoutStatus', () => {
  it('returns ready for a fresh workout', () => {
    expect(getWorkoutStatus(createTimerState())).toBe('ready')
  })

  it('returns running when the workout is active', () => {
    expect(getWorkoutStatus(createTimerState({ isRunning: true }))).toBe(
      'running'
    )
  })

  it('returns paused when the workout has progress but is not running', () => {
    expect(
      getWorkoutStatus(createTimerState({ currentTimeSeconds: 1190 }))
    ).toBe('paused')
  })

  it('returns break when a break timer is active', () => {
    expect(
      getWorkoutStatus(
        createTimerState({
          isRunning: true,
          breakTimeSeconds: 45,
          activeBreakDurationSeconds: 45,
        })
      )
    ).toBe('break')
  })

  it('returns complete when the workout is complete', () => {
    expect(getWorkoutStatus(createTimerState({ isComplete: true }))).toBe(
      'complete'
    )
  })
})

describe('isFreshWorkout', () => {
  it('treats a ready timer workout as fresh', () => {
    expect(isFreshWorkout(createTimerState())).toBe(true)
  })

  it('treats a ready sets workout with adjusted target as fresh', () => {
    expect(
      isFreshWorkout(
        createSetsState({
          targetSets: 45,
        })
      )
    ).toBe(true)
  })

  it('returns false once progress has been made', () => {
    expect(
      isFreshWorkout(
        createSetsState({
          currentTimeSeconds: 12,
          totalActiveTimeSeconds: 12,
          isRunning: false,
        })
      )
    ).toBe(false)
  })
})

describe('isConfigLocked', () => {
  it('returns false for a fresh workout', () => {
    expect(isConfigLocked(createTimerState())).toBe(false)
  })

  it('returns true while running, paused, on break, or complete', () => {
    expect(isConfigLocked(createTimerState({ isRunning: true }))).toBe(true)
    expect(isConfigLocked(createTimerState({ currentTimeSeconds: 1180 }))).toBe(
      true
    )
    expect(
      isConfigLocked(
        createTimerState({
          isRunning: true,
          breakTimeSeconds: 30,
          activeBreakDurationSeconds: 30,
        })
      )
    ).toBe(true)
    expect(isConfigLocked(createTimerState({ isComplete: true }))).toBe(true)
  })
})

describe('getRemainingSets', () => {
  it('derives remaining sets from target minus completed', () => {
    expect(getRemainingSets(createSetsState({ completedSets: 3 }))).toBe(27)
  })

  it('never returns a negative number', () => {
    expect(getRemainingSets(createSetsState({ completedSets: 50 }))).toBe(0)
  })
})

describe('getMainDisplay', () => {
  it('formats timer mode as mm:ss', () => {
    expect(getMainDisplay(createTimerState({ currentTimeSeconds: 245 }))).toBe(
      '04:05'
    )
  })

  it('formats sets mode as remaining / target', () => {
    expect(
      getMainDisplay(createSetsState({ targetSets: 30, completedSets: 3 }))
    ).toBe('27 / 30')
  })
})

describe('getCompletionStats', () => {
  it('returns timer mode completion stats', () => {
    expect(
      getCompletionStats(
        createTimerState({
          completedSets: 12,
          timerDurationSeconds: 20 * 60,
        })
      )
    ).toEqual([
      { label: 'SETS COMPLETED', value: '12', tone: 'accent' },
      { label: 'DURATION', value: '20:00', tone: 'default' },
    ])
  })

  it('returns sets mode completion stats', () => {
    expect(
      getCompletionStats(
        createSetsState({
          completedSets: 30,
          totalActiveTimeSeconds: 9 * 60 + 30,
        })
      )
    ).toEqual([
      { label: 'SETS COMPLETED', value: '30', tone: 'accent' },
      { label: 'ACTIVE TIME', value: '09:30', tone: 'default' },
    ])
  })
})

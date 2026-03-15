import { describe, expect, it } from 'vitest'
import {
  DEFAULT_TARGET_SETS,
  DEFAULT_TIMER_DURATION_SECONDS,
  MAX_TARGET_SETS,
  MAX_TIMER_DURATION_SECONDS,
  MIN_TARGET_SETS,
  MIN_TIMER_DURATION_SECONDS,
} from './constants'
import { createInitialWorkoutState, workoutReducer } from './reducer'
import type { WorkoutState } from './types'

function tickState(state: WorkoutState, ticks: number = 1): WorkoutState {
  let nextState = state

  for (let index = 0; index < ticks; index += 1) {
    nextState = workoutReducer(nextState, { type: 'tickSecond' })
  }

  return nextState
}

describe('createInitialWorkoutState', () => {
  it('creates the default timer mode state', () => {
    expect(createInitialWorkoutState()).toEqual({
      mode: 'timer',
      timerDurationSeconds: DEFAULT_TIMER_DURATION_SECONDS,
      targetSets: DEFAULT_TARGET_SETS,
      currentTimeSeconds: DEFAULT_TIMER_DURATION_SECONDS,
      totalActiveTimeSeconds: 0,
      completedSets: 0,
      isRunning: false,
      breakTimeSeconds: 0,
      activeBreakDurationSeconds: 0,
      isComplete: false,
    })
  })

  it('creates the default sets mode state', () => {
    expect(createInitialWorkoutState({ mode: 'sets' })).toEqual({
      mode: 'sets',
      timerDurationSeconds: DEFAULT_TIMER_DURATION_SECONDS,
      targetSets: DEFAULT_TARGET_SETS,
      currentTimeSeconds: 0,
      totalActiveTimeSeconds: 0,
      completedSets: 0,
      isRunning: false,
      breakTimeSeconds: 0,
      activeBreakDurationSeconds: 0,
      isComplete: false,
    })
  })
})

describe('workoutReducer', () => {
  it('switches modes by resetting to that mode default state', () => {
    const state = workoutReducer(createInitialWorkoutState(), {
      type: 'setMode',
      mode: 'sets',
    })

    expect(state).toEqual(createInitialWorkoutState({ mode: 'sets' }))
  })

  it('toggles running when not on break or complete', () => {
    const runningState = workoutReducer(createInitialWorkoutState(), {
      type: 'toggleRunning',
    })
    const pausedState = workoutReducer(runningState, {
      type: 'toggleRunning',
    })

    expect(runningState.isRunning).toBe(true)
    expect(pausedState.isRunning).toBe(false)
  })

  it('ignores play and pause while a break is active', () => {
    const state = workoutReducer(
      createInitialWorkoutState({
        mode: 'timer',
      }),
      { type: 'toggleRunning' }
    )
    const breakState = workoutReducer(state, {
      type: 'startBreak',
      durationSeconds: 45,
    })

    expect(
      workoutReducer(breakState, {
        type: 'toggleRunning',
      })
    ).toEqual(breakState)
  })

  it('adjusts timer duration while fresh and clamps to bounds', () => {
    const longerState = workoutReducer(createInitialWorkoutState(), {
      type: 'adjustTimerDuration',
      deltaSeconds: 5 * 60,
    })
    const shorterState = workoutReducer(
      createInitialWorkoutState({
        timerDurationSeconds: 5 * 60,
        currentTimeSeconds: 5 * 60,
      }),
      {
        type: 'adjustTimerDuration',
        deltaSeconds: -10 * 60,
      }
    )
    const maxedState = workoutReducer(
      createInitialWorkoutState({
        timerDurationSeconds: MAX_TIMER_DURATION_SECONDS,
        currentTimeSeconds: MAX_TIMER_DURATION_SECONDS,
      }),
      {
        type: 'adjustTimerDuration',
        deltaSeconds: 5 * 60,
      }
    )

    expect(longerState.timerDurationSeconds).toBe(
      DEFAULT_TIMER_DURATION_SECONDS + 5 * 60
    )
    expect(longerState.currentTimeSeconds).toBe(
      DEFAULT_TIMER_DURATION_SECONDS + 5 * 60
    )
    expect(shorterState.timerDurationSeconds).toBe(MIN_TIMER_DURATION_SECONDS)
    expect(shorterState.currentTimeSeconds).toBe(MIN_TIMER_DURATION_SECONDS)
    expect(maxedState.timerDurationSeconds).toBe(MAX_TIMER_DURATION_SECONDS)
  })

  it('ignores timer duration adjustments while locked or in sets mode', () => {
    const runningState = workoutReducer(createInitialWorkoutState(), {
      type: 'toggleRunning',
    })
    const setsState = createInitialWorkoutState({ mode: 'sets' })

    expect(
      workoutReducer(runningState, {
        type: 'adjustTimerDuration',
        deltaSeconds: 5 * 60,
      })
    ).toEqual(runningState)
    expect(
      workoutReducer(setsState, {
        type: 'adjustTimerDuration',
        deltaSeconds: 5 * 60,
      })
    ).toEqual(setsState)
  })

  it('adjusts target sets while fresh and clamps to bounds', () => {
    const longerState = workoutReducer(
      createInitialWorkoutState({ mode: 'sets' }),
      {
        type: 'adjustTargetSets',
        deltaSets: 5,
      }
    )
    const shorterState = workoutReducer(
      createInitialWorkoutState({
        mode: 'sets',
        targetSets: 3,
      }),
      {
        type: 'adjustTargetSets',
        deltaSets: -10,
      }
    )
    const maxedState = workoutReducer(
      createInitialWorkoutState({
        mode: 'sets',
        targetSets: MAX_TARGET_SETS,
      }),
      {
        type: 'adjustTargetSets',
        deltaSets: 5,
      }
    )

    expect(longerState.targetSets).toBe(DEFAULT_TARGET_SETS + 5)
    expect(shorterState.targetSets).toBe(MIN_TARGET_SETS)
    expect(maxedState.targetSets).toBe(MAX_TARGET_SETS)
  })

  it('ignores target set adjustments while locked or in timer mode', () => {
    const runningState = workoutReducer(
      createInitialWorkoutState({ mode: 'sets' }),
      {
        type: 'toggleRunning',
      }
    )
    const timerState = createInitialWorkoutState()

    expect(
      workoutReducer(runningState, {
        type: 'adjustTargetSets',
        deltaSets: 5,
      })
    ).toEqual(runningState)
    expect(
      workoutReducer(timerState, {
        type: 'adjustTargetSets',
        deltaSets: 5,
      })
    ).toEqual(timerState)
  })

  it('ticks timer mode down and completes at zero', () => {
    const runningState = workoutReducer(
      createInitialWorkoutState({
        currentTimeSeconds: 2,
        timerDurationSeconds: 2,
      }),
      {
        type: 'toggleRunning',
      }
    )
    const completedState = tickState(runningState, 2)

    expect(completedState.currentTimeSeconds).toBe(0)
    expect(completedState.isRunning).toBe(false)
    expect(completedState.isComplete).toBe(true)
  })

  it('ticks sets mode up and accumulates active time', () => {
    const runningState = workoutReducer(
      createInitialWorkoutState({ mode: 'sets' }),
      {
        type: 'toggleRunning',
      }
    )
    const progressedState = tickState(runningState, 3)

    expect(progressedState.currentTimeSeconds).toBe(3)
    expect(progressedState.totalActiveTimeSeconds).toBe(3)
    expect(progressedState.isComplete).toBe(false)
  })

  it('starts a timer mode break and increments completed sets immediately', () => {
    const runningState = workoutReducer(createInitialWorkoutState(), {
      type: 'toggleRunning',
    })
    const breakState = workoutReducer(runningState, {
      type: 'startBreak',
      durationSeconds: 45,
    })

    expect(breakState.completedSets).toBe(1)
    expect(breakState.breakTimeSeconds).toBe(45)
    expect(breakState.activeBreakDurationSeconds).toBe(45)
    expect(breakState.isRunning).toBe(true)
  })

  it('starts a sets mode break, resets the current set timer, and keeps total active time', () => {
    const runningState = tickState(
      workoutReducer(createInitialWorkoutState({ mode: 'sets' }), {
        type: 'toggleRunning',
      }),
      10
    )
    const breakState = workoutReducer(runningState, {
      type: 'startBreak',
      durationSeconds: 30,
    })

    expect(breakState.completedSets).toBe(1)
    expect(breakState.currentTimeSeconds).toBe(0)
    expect(breakState.totalActiveTimeSeconds).toBe(10)
    expect(breakState.breakTimeSeconds).toBe(30)
  })

  it('completes sets mode immediately when the final set starts a break', () => {
    const runningState = workoutReducer(
      createInitialWorkoutState({
        mode: 'sets',
        targetSets: 1,
      }),
      {
        type: 'toggleRunning',
      }
    )
    const completedState = workoutReducer(runningState, {
      type: 'startBreak',
      durationSeconds: 30,
    })

    expect(completedState.completedSets).toBe(1)
    expect(completedState.breakTimeSeconds).toBe(0)
    expect(completedState.activeBreakDurationSeconds).toBe(0)
    expect(completedState.isRunning).toBe(false)
    expect(completedState.isComplete).toBe(true)
  })

  it('ignores break starts while paused, already on break, or complete', () => {
    const pausedState = createInitialWorkoutState()
    const runningBreakState = workoutReducer(
      workoutReducer(createInitialWorkoutState(), {
        type: 'toggleRunning',
      }),
      {
        type: 'startBreak',
        durationSeconds: 30,
      }
    )
    const completedState = {
      ...createInitialWorkoutState(),
      isComplete: true,
    }

    expect(
      workoutReducer(pausedState, {
        type: 'startBreak',
        durationSeconds: 30,
      })
    ).toEqual(pausedState)
    expect(
      workoutReducer(runningBreakState, {
        type: 'startBreak',
        durationSeconds: 30,
      })
    ).toEqual(runningBreakState)
    expect(
      workoutReducer(completedState, {
        type: 'startBreak',
        durationSeconds: 30,
      })
    ).toEqual(completedState)
  })

  it('ticks an active timer break and completes immediately when the timer reaches zero', () => {
    const breakState = {
      ...createInitialWorkoutState(),
      currentTimeSeconds: 1,
      isRunning: true,
      breakTimeSeconds: 30,
      activeBreakDurationSeconds: 30,
    }
    const completedState = workoutReducer(breakState, {
      type: 'tickSecond',
    })

    expect(completedState.currentTimeSeconds).toBe(0)
    expect(completedState.breakTimeSeconds).toBe(0)
    expect(completedState.activeBreakDurationSeconds).toBe(0)
    expect(completedState.isRunning).toBe(false)
    expect(completedState.isComplete).toBe(true)
  })

  it('ticks a sets mode break without adding active time and resumes cleanly when the break ends', () => {
    const breakState = {
      ...createInitialWorkoutState({ mode: 'sets' }),
      isRunning: true,
      completedSets: 1,
      totalActiveTimeSeconds: 10,
      breakTimeSeconds: 1,
      activeBreakDurationSeconds: 30,
    }
    const resumedState = workoutReducer(breakState, {
      type: 'tickSecond',
    })

    expect(resumedState.currentTimeSeconds).toBe(0)
    expect(resumedState.totalActiveTimeSeconds).toBe(10)
    expect(resumedState.breakTimeSeconds).toBe(0)
    expect(resumedState.activeBreakDurationSeconds).toBe(0)
    expect(resumedState.isRunning).toBe(true)
  })

  it('resets progress while preserving the current mode configuration', () => {
    const timerState = {
      ...createInitialWorkoutState(),
      timerDurationSeconds: 25 * 60,
      currentTimeSeconds: 14 * 60,
      completedSets: 4,
      totalActiveTimeSeconds: 99,
      isRunning: true,
      breakTimeSeconds: 30,
      activeBreakDurationSeconds: 30,
    }
    const setsState = {
      ...createInitialWorkoutState({ mode: 'sets' }),
      targetSets: 45,
      currentTimeSeconds: 20,
      totalActiveTimeSeconds: 120,
      completedSets: 12,
      isRunning: true,
    }

    expect(workoutReducer(timerState, { type: 'resetWorkout' })).toEqual({
      ...createInitialWorkoutState(),
      timerDurationSeconds: 25 * 60,
      currentTimeSeconds: 25 * 60,
    })
    expect(workoutReducer(setsState, { type: 'resetWorkout' })).toEqual({
      ...createInitialWorkoutState({ mode: 'sets' }),
      targetSets: 45,
    })
  })
})

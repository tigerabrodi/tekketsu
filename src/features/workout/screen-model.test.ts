import { describe, expect, it, vi } from 'vitest'
import {
  createWorkoutScreenActions,
  createWorkoutScreenModel,
  withConfigActions,
} from './screen-model'
import { createInitialWorkoutState } from './reducer'

describe('createWorkoutScreenModel', () => {
  it('maps timer mode state into the ready timer shell model', () => {
    expect(createWorkoutScreenModel(createInitialWorkoutState())).toMatchObject(
      {
        status: 'ready',
        mainDisplay: '20:00',
        secondaryValue: '0',
        secondaryLabel: 'SETS COMPLETED',
        adjusterValue: '20',
        adjusterUnitLabel: 'MINUTES',
        isTimerMode: true,
        isTimerTabActive: true,
        isSetsTabActive: false,
      }
    )
  })

  it('maps sets mode state into the ready sets shell model', () => {
    expect(
      createWorkoutScreenModel(
        createInitialWorkoutState({
          mode: 'sets',
        })
      )
    ).toMatchObject({
      status: 'ready',
      mainDisplay: '30 / 30',
      secondaryValue: '00:00',
      secondaryLabel: 'STOPWATCH',
      adjusterValue: '30',
      adjusterUnitLabel: 'SETS',
      isTimerMode: false,
      isTimerTabActive: false,
      isSetsTabActive: true,
    })
  })
})

describe('withConfigActions', () => {
  it('wires timer mode config actions to timer duration deltas', () => {
    const onAdjustTimerDuration = vi.fn()
    const onAdjustTargetSets = vi.fn()
    const baseActions = createWorkoutScreenActions({
      onChangeMode: vi.fn(),
      onAdjustTimerDuration,
      onAdjustTargetSets,
      onSignOut: vi.fn(),
    })

    const actions = withConfigActions(
      createInitialWorkoutState(),
      baseActions,
      {
        onAdjustTimerDuration,
        onAdjustTargetSets,
      }
    )

    actions.onDecreaseConfig()
    actions.onIncreaseConfig()

    expect(onAdjustTimerDuration).toHaveBeenNthCalledWith(1, -(5 * 60))
    expect(onAdjustTimerDuration).toHaveBeenNthCalledWith(2, 5 * 60)
    expect(onAdjustTargetSets).not.toHaveBeenCalled()
  })

  it('wires sets mode config actions to target set deltas', () => {
    const onAdjustTimerDuration = vi.fn()
    const onAdjustTargetSets = vi.fn()
    const baseActions = createWorkoutScreenActions({
      onChangeMode: vi.fn(),
      onAdjustTimerDuration,
      onAdjustTargetSets,
      onSignOut: vi.fn(),
    })

    const actions = withConfigActions(
      createInitialWorkoutState({
        mode: 'sets',
      }),
      baseActions,
      {
        onAdjustTimerDuration,
        onAdjustTargetSets,
      }
    )

    actions.onDecreaseConfig()
    actions.onIncreaseConfig()

    expect(onAdjustTargetSets).toHaveBeenNthCalledWith(1, -5)
    expect(onAdjustTargetSets).toHaveBeenNthCalledWith(2, 5)
    expect(onAdjustTimerDuration).not.toHaveBeenCalled()
  })
})

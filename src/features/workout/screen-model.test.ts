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

  it('maps a running timer workout into an interactive state', () => {
    expect(
      createWorkoutScreenModel(
        createInitialWorkoutState({
          isRunning: true,
          currentTimeSeconds: 17 * 60 + 23,
          completedSets: 3,
        })
      )
    ).toMatchObject({
      status: 'running',
      statusLabel: 'RUNNING',
      mainDisplay: '17:23',
      secondaryValue: '3',
      isConfigDisabled: true,
      isPrimaryControlDisabled: false,
      primaryControlIcon: 'pause',
      isBreakActive: false,
      showBreakPresets: true,
    })
  })

  it('maps a paused sets workout into a locked state', () => {
    expect(
      createWorkoutScreenModel(
        createInitialWorkoutState({
          mode: 'sets',
          currentTimeSeconds: 42,
          totalActiveTimeSeconds: 42,
        })
      )
    ).toMatchObject({
      status: 'paused',
      statusLabel: 'PAUSED',
      secondaryValue: '00:42',
      isConfigDisabled: true,
      isPrimaryControlDisabled: false,
      primaryControlIcon: 'play',
      areBreakPresetsDisabled: true,
      showBreakPresets: true,
    })
  })

  it('maps a break-active workout into the break panel state', () => {
    expect(
      createWorkoutScreenModel(
        createInitialWorkoutState({
          isRunning: true,
          currentTimeSeconds: 17 * 60 + 23,
          completedSets: 3,
          breakTimeSeconds: 32,
          activeBreakDurationSeconds: 45,
        })
      )
    ).toMatchObject({
      status: 'break',
      statusLabel: 'RUNNING',
      isConfigDisabled: true,
      isPrimaryControlDisabled: true,
      primaryControlIcon: 'play',
      isBreakActive: true,
      showBreakPresets: false,
      breakCountdownDisplay: '0:32',
      breakSummaryLabel: 'MEDIUM - 0:45',
    })
  })

  it('maps a completed timer workout into the completion card state', () => {
    expect(
      createWorkoutScreenModel(
        createInitialWorkoutState({
          isComplete: true,
          completedSets: 12,
          timerDurationSeconds: 20 * 60,
          currentTimeSeconds: 0,
        })
      )
    ).toMatchObject({
      status: 'complete',
      isCompletionVisible: true,
      completionStats: [
        { label: 'SETS COMPLETED', value: '12', tone: 'accent' },
        { label: 'DURATION', value: '20:00', tone: 'default' },
      ],
    })
  })

  it('maps a completed sets workout into the completion card state', () => {
    expect(
      createWorkoutScreenModel(
        createInitialWorkoutState({
          mode: 'sets',
          isComplete: true,
          completedSets: 30,
          totalActiveTimeSeconds: 9 * 60 + 30,
        })
      )
    ).toMatchObject({
      status: 'complete',
      isCompletionVisible: true,
      completionStats: [
        { label: 'SETS COMPLETED', value: '30', tone: 'accent' },
        { label: 'ACTIVE TIME', value: '09:30', tone: 'default' },
      ],
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
      onToggleRunning: vi.fn(),
      onReset: vi.fn(),
      onStartBreak: vi.fn(),
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
      onToggleRunning: vi.fn(),
      onReset: vi.fn(),
      onStartBreak: vi.fn(),
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

type WorkoutMode = 'timer' | 'sets'

type WorkoutStatus = 'ready' | 'running' | 'paused' | 'break' | 'complete'

type BreakPreset = {
  label: string
  durationSeconds: number
  display: string
}

type CompletionStatTone = 'accent' | 'default'

type CompletionStat = {
  label: string
  value: string
  tone: CompletionStatTone
}

type WorkoutState = {
  mode: WorkoutMode
  timerDurationSeconds: number
  targetSets: number
  currentTimeSeconds: number
  totalActiveTimeSeconds: number
  completedSets: number
  isRunning: boolean
  breakTimeSeconds: number
  activeBreakDurationSeconds: number
  isComplete: boolean
}

type WorkoutAction =
  | { type: 'setMode'; mode: WorkoutMode }
  | { type: 'toggleRunning' }
  | { type: 'resetWorkout' }
  | { type: 'tickSecond' }
  | { type: 'startBreak'; durationSeconds: number }
  | { type: 'adjustTimerDuration'; deltaSeconds: number }
  | { type: 'adjustTargetSets'; deltaSets: number }

type WorkoutScreenModel = {
  state: WorkoutState
  status: WorkoutStatus
  statusLabel: string
  mainDisplay: string
  secondaryValue: string
  secondaryLabel: string
  adjusterValue: string
  adjusterUnitLabel: string
  isTimerMode: boolean
  isTimerTabActive: boolean
  isSetsTabActive: boolean
  isConfigDisabled: boolean
  isPrimaryControlDisabled: boolean
  primaryControlIcon: 'play' | 'pause'
  isBreakActive: boolean
  showBreakPresets: boolean
  areBreakPresetsDisabled: boolean
  breakCountdownDisplay: string | null
  breakSummaryLabel: string | null
  breakPresets: Array<BreakPreset>
}

type WorkoutScreenActions = {
  onSelectTimerMode: () => void
  onSelectSetsMode: () => void
  onDecreaseConfig: () => void
  onIncreaseConfig: () => void
  onToggleRunning: () => void
  onReset: () => void
  onStartBreak: (durationSeconds: number) => void
  onSignOut: () => void
}

export type {
  BreakPreset,
  CompletionStat,
  CompletionStatTone,
  WorkoutAction,
  WorkoutMode,
  WorkoutScreenActions,
  WorkoutScreenModel,
  WorkoutState,
  WorkoutStatus,
}

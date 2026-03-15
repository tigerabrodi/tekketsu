import type { WorkoutScreenActions, WorkoutScreenModel } from '../types'
import { BreakPresets } from './break-presets'
import { ConfigAdjuster } from './config-adjuster'
import { ControlBar } from './control-bar'
import { MainDisplay } from './main-display'
import { ModeToggle } from './mode-toggle'
import { WorkoutTopBar } from './workout-top-bar'

function WorkoutScreen({
  model,
  actions,
}: {
  model: WorkoutScreenModel
  actions: WorkoutScreenActions
}) {
  return (
    <main className="bg-bg mx-auto flex h-dvh w-full max-w-[390px] flex-col overflow-hidden">
      <WorkoutTopBar onSignOut={actions.onSignOut} />

      <ModeToggle
        isTimerTabActive={model.isTimerTabActive}
        isSetsTabActive={model.isSetsTabActive}
        onSelectTimerMode={actions.onSelectTimerMode}
        onSelectSetsMode={actions.onSelectSetsMode}
      />

      <ConfigAdjuster
        value={model.adjusterValue}
        unitLabel={model.adjusterUnitLabel}
        onDecrease={actions.onDecreaseConfig}
        onIncrease={actions.onIncreaseConfig}
      />

      <MainDisplay
        isTimerMode={model.isTimerMode}
        mainDisplay={model.mainDisplay}
        statusLabel={model.status.toUpperCase()}
        secondaryValue={model.secondaryValue}
        secondaryLabel={model.secondaryLabel}
      />

      <ControlBar />

      <div className="flex justify-center px-6 py-2">
        <div className="bg-border h-px w-full max-w-[342px]" />
      </div>

      <BreakPresets breakPresets={model.breakPresets} />
    </main>
  )
}

export { WorkoutScreen }

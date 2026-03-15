import { CompletionCard } from './completion-card'
import type { WorkoutScreenActions, WorkoutScreenModel } from '../types'
import { BreakActivePanel } from './break-active-panel'
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
        disabled={model.isConfigDisabled}
        isTimerTabActive={model.isTimerTabActive}
        isSetsTabActive={model.isSetsTabActive}
        onSelectTimerMode={actions.onSelectTimerMode}
        onSelectSetsMode={actions.onSelectSetsMode}
      />

      {model.isCompletionVisible ? (
        <CompletionCard
          completionStats={model.completionStats}
          onReset={actions.onReset}
        />
      ) : (
        <>
          <ConfigAdjuster
            disabled={model.isConfigDisabled}
            value={model.adjusterValue}
            unitLabel={model.adjusterUnitLabel}
            onDecrease={actions.onDecreaseConfig}
            onIncrease={actions.onIncreaseConfig}
          />

          <MainDisplay
            isTimerMode={model.isTimerMode}
            mainDisplay={model.mainDisplay}
            statusLabel={model.statusLabel}
            secondaryValue={model.secondaryValue}
            secondaryLabel={model.secondaryLabel}
          />

          <ControlBar
            isPrimaryControlDisabled={model.isPrimaryControlDisabled}
            onReset={actions.onReset}
            onToggleRunning={actions.onToggleRunning}
            primaryControlIcon={model.primaryControlIcon}
          />

          <div className="flex justify-center px-6 py-2">
            <div className="bg-border h-px w-full max-w-[342px]" />
          </div>

          {model.isBreakActive &&
          model.breakCountdownDisplay &&
          model.breakSummaryLabel ? (
            <BreakActivePanel
              countdownDisplay={model.breakCountdownDisplay}
              summaryLabel={model.breakSummaryLabel}
            />
          ) : (
            <BreakPresets
              areBreakPresetsDisabled={model.areBreakPresetsDisabled}
              breakPresets={model.breakPresets}
              onStartBreak={actions.onStartBreak}
            />
          )}
        </>
      )}
    </main>
  )
}

export { WorkoutScreen }

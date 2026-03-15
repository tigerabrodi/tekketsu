import type { BreakPreset } from '../types'

function BreakPresets({
  areBreakPresetsDisabled,
  breakPresets,
  onStartBreak,
}: {
  areBreakPresetsDisabled: boolean
  breakPresets: Array<BreakPreset>
  onStartBreak: (durationSeconds: number) => void
}) {
  return (
    <>
      <div className="flex justify-center px-6 pt-2 pb-1">
        <span className="font-mono text-[9px] leading-[12px] font-medium tracking-[0.2em] text-[rgba(17,17,17,0.25)]">
          BREAK DURATION
        </span>
      </div>

      <div className="flex items-center justify-center gap-1.5 px-5 py-1">
        {breakPresets.map((breakPreset) => (
          <button
            key={breakPreset.label}
            type="button"
            disabled={areBreakPresetsDisabled}
            onClick={() => onStartBreak(breakPreset.durationSeconds)}
            className="flex h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 border border-[rgba(17,17,17,0.1)] disabled:cursor-default disabled:opacity-100"
          >
            <span className="font-body text-text-primary text-[16px] leading-[18px]">
              {breakPreset.display}
            </span>
            <span className="font-mono text-[8px] leading-[10px] tracking-[0.05em] text-[rgba(17,17,17,0.25)]">
              {breakPreset.label}
            </span>
          </button>
        ))}
      </div>
    </>
  )
}

export { BreakPresets }

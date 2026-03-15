import { cn } from '@/utils/cn'

function ModeToggle({
  isTimerTabActive,
  isSetsTabActive,
  onSelectTimerMode,
  onSelectSetsMode,
}: {
  isTimerTabActive: boolean
  isSetsTabActive: boolean
  onSelectTimerMode: () => void
  onSelectSetsMode: () => void
}) {
  return (
    <div className="flex justify-center px-6 py-3">
      <div className="flex">
        <button
          type="button"
          onClick={onSelectTimerMode}
          className={cn(
            'flex items-center justify-center px-6 py-2 font-mono text-[11px] leading-[14px] tracking-[0.15em]',
            isTimerTabActive
              ? 'bg-text-primary text-text-on-dark font-medium'
              : 'border border-[rgba(17,17,17,0.12)] text-[rgba(17,17,17,0.35)]'
          )}
        >
          TIMER
        </button>
        <button
          type="button"
          onClick={onSelectSetsMode}
          className={cn(
            'flex items-center justify-center px-6 py-2 font-mono text-[11px] leading-[14px] tracking-[0.15em]',
            isSetsTabActive
              ? 'bg-text-primary text-text-on-dark font-medium'
              : 'border border-l-0 border-[rgba(17,17,17,0.12)] text-[rgba(17,17,17,0.35)]'
          )}
        >
          SETS
        </button>
      </div>
    </div>
  )
}

export { ModeToggle }

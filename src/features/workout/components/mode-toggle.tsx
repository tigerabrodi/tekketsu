import { cn } from '@/utils/cn'

function ModeToggle({
  disabled,
  isTimerTabActive,
  isSetsTabActive,
  onSelectTimerMode,
  onSelectSetsMode,
}: {
  disabled: boolean
  isTimerTabActive: boolean
  isSetsTabActive: boolean
  onSelectTimerMode: () => void
  onSelectSetsMode: () => void
}) {
  return (
    <div
      className={cn('flex justify-center px-6 py-3', disabled && 'opacity-30')}
    >
      <div className="flex">
        <button
          type="button"
          disabled={disabled}
          onClick={onSelectTimerMode}
          className={cn(
            'flex items-center justify-center px-6 py-2 font-mono text-[11px] leading-[14px] tracking-[0.15em] disabled:cursor-default',
            isTimerTabActive
              ? 'bg-text-primary text-text-on-dark font-medium'
              : 'border border-[rgba(17,17,17,0.12)] text-[rgba(17,17,17,0.35)]'
          )}
        >
          TIMER
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onSelectSetsMode}
          className={cn(
            'flex items-center justify-center px-6 py-2 font-mono text-[11px] leading-[14px] tracking-[0.15em] disabled:cursor-default',
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

import { cn } from '@/utils/cn'

function ConfigAdjuster({
  disabled,
  value,
  unitLabel,
  onDecrease,
  onIncrease,
}: {
  disabled: boolean
  value: string
  unitLabel: string
  onDecrease: () => void
  onIncrease: () => void
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center gap-5 px-6 py-2',
        disabled && 'opacity-30'
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={onDecrease}
        className="flex h-8 w-8 items-center justify-center border border-[rgba(17,17,17,0.12)] font-mono text-[20px] leading-[20px] text-[rgba(17,17,17,0.35)] disabled:cursor-default"
      >
        -
      </button>

      <div className="flex min-w-[48px] flex-col items-center">
        <span className="text-text-primary font-mono text-[20px] leading-[24px] font-medium">
          {value}
        </span>
        <span className="font-mono text-[9px] leading-[12px] tracking-[0.15em] text-[rgba(17,17,17,0.3)]">
          {unitLabel}
        </span>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onIncrease}
        className="flex h-8 w-8 items-center justify-center border border-[rgba(17,17,17,0.12)] font-mono text-[20px] leading-[20px] text-[rgba(17,17,17,0.35)] disabled:cursor-default"
      >
        +
      </button>
    </div>
  )
}

export { ConfigAdjuster }

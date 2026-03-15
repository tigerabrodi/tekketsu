function ReadyStatus({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="bg-accent h-1.5 w-1.5 rounded-full" />
      <span className="font-mono text-[10px] leading-[14px] tracking-[0.15em] text-[rgba(17,17,17,0.35)]">
        {label}
      </span>
    </div>
  )
}

function MainDisplay({
  isTimerMode,
  mainDisplay,
  statusLabel,
  secondaryValue,
  secondaryLabel,
}: {
  isTimerMode: boolean
  mainDisplay: string
  statusLabel: string
  secondaryValue: string
  secondaryLabel: string
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-2 px-6 py-8">
        <div
          className={
            isTimerMode
              ? 'font-display text-text-primary text-[96px] leading-[96px] font-[800] tracking-[-0.02em]'
              : 'font-display text-text-primary text-[80px] leading-[80px] font-[800] tracking-[-0.02em]'
          }
        >
          {mainDisplay}
        </div>
        <ReadyStatus label={statusLabel} />
      </div>

      <div className="flex items-center justify-center gap-2 px-6">
        <span
          className={
            isTimerMode
              ? 'font-display text-accent text-[28px] leading-[32px] font-[800]'
              : 'font-mono text-[20px] leading-[24px] font-bold text-[rgba(17,17,17,0.4)]'
          }
        >
          {secondaryValue}
        </span>
        <span className="font-mono text-[10px] leading-[14px] tracking-[0.15em] text-[rgba(17,17,17,0.3)]">
          {secondaryLabel}
        </span>
      </div>
    </>
  )
}

export { MainDisplay }

function BreakActivePanel({
  countdownDisplay,
  summaryLabel,
}: {
  countdownDisplay: string
  summaryLabel: string
}) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 pt-4">
      <div className="flex items-center gap-2">
        <span className="bg-accent h-2 w-2 rounded-full" />
        <span className="text-text-primary font-mono text-[10px] leading-[14px] tracking-[0.15em]">
          BREAK IN PROGRESS
        </span>
        <span className="bg-accent h-2 w-2 rounded-full" />
      </div>

      <div className="font-display text-accent text-[64px] leading-[64px] font-[800] tracking-[-0.02em]">
        {countdownDisplay}
      </div>

      <div className="font-mono text-[10px] leading-[14px] tracking-[0.1em] text-[rgba(17,17,17,0.3)]">
        {summaryLabel}
      </div>
    </div>
  )
}

export { BreakActivePanel }

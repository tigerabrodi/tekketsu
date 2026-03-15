import type { CompletionStat } from '../types'

function RestartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.9987 3.33337C10.576 3.33337 12.6654 5.42271 12.6654 8.00004C12.6654 10.5774 10.576 12.6667 7.9987 12.6667C5.8107 12.6667 3.97403 11.1614 3.4687 9.13337"
        stroke="#FAFAFA"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M4.00004 5.33333V2.66667M4.00004 2.66667H6.66671M4.00004 2.66667L7.00004 5.66667"
        stroke="#FAFAFA"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CompletionCard({
  completionStats,
  onReset,
}: {
  completionStats: Array<CompletionStat>
  onReset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-8">
      <div className="flex flex-col items-center gap-2">
        <img
          src="/assets/guts-swords-crossed-transparent-optimized.png"
          alt=""
          aria-hidden="true"
          className="h-12 w-12 object-contain opacity-70"
        />
        <h2 className="font-display text-text-primary text-[28px] leading-[32px] font-[800]">
          Workout Complete
        </h2>
      </div>

      <div className="bg-accent h-0.5 w-10" />

      <div className="flex w-full flex-col items-center gap-3">
        {completionStats.map((completionStat, index) => (
          <div
            key={completionStat.label}
            className={`flex w-full items-center justify-between ${
              index === 0
                ? 'border-b border-[rgba(17,17,17,0.06)] py-3'
                : 'border-b border-[rgba(17,17,17,0.06)] pb-3'
            }`}
          >
            <span className="font-mono text-[10px] leading-[14px] tracking-[0.15em] text-[rgba(17,17,17,0.3)]">
              {completionStat.label}
            </span>
            <span
              className={
                completionStat.tone === 'accent'
                  ? 'font-display text-accent text-[24px] leading-[28px] font-[800]'
                  : 'font-display text-text-primary text-[24px] leading-[28px] font-[800]'
              }
            >
              {completionStat.value}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="bg-text-primary text-text-on-dark flex w-full items-center justify-center gap-2.5 px-8 py-4 font-mono text-[18px] leading-[18px]"
      >
        <RestartIcon />
        Start New Workout
      </button>
    </div>
  )
}

export { CompletionCard }

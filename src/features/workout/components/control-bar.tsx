function PlayIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
    >
      <path d="M7 4.75L17 11L7 17.25V4.75Z" fill="#FAFAFA" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
    >
      <rect x="6" y="4.5" width="3.5" height="13" fill="#FAFAFA" />
      <rect x="12.5" y="4.5" width="3.5" height="13" fill="#FAFAFA" />
    </svg>
  )
}

function ResetIcon() {
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
        stroke="rgba(17,17,17,0.35)"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M4.00004 5.33333V2.66667M4.00004 2.66667H6.66671M4.00004 2.66667L7.00004 5.66667"
        stroke="rgba(17,17,17,0.35)"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ControlBar({
  isPrimaryControlDisabled,
  onReset,
  onToggleRunning,
  primaryControlIcon,
}: {
  isPrimaryControlDisabled: boolean
  onReset: () => void
  onToggleRunning: () => void
  primaryControlIcon: 'play' | 'pause'
}) {
  return (
    <div className="flex items-center justify-center gap-4 px-6 py-5">
      <button
        type="button"
        disabled={isPrimaryControlDisabled}
        onClick={onToggleRunning}
        className="bg-text-primary flex h-14 w-14 items-center justify-center rounded-full disabled:cursor-default disabled:opacity-100"
      >
        {primaryControlIcon === 'pause' ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button
        type="button"
        onClick={onReset}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(17,17,17,0.15)]"
      >
        <ResetIcon />
      </button>
    </div>
  )
}

export { ControlBar }

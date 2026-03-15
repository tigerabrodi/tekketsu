function WorkoutTopBar({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <img
          src="/assets/guts-swords-crossed-transparent-optimized.png"
          alt=""
          aria-hidden="true"
          className="h-5 w-5 object-contain opacity-60"
        />
        <span className="font-mono text-[10px] leading-[14px] font-medium tracking-[0.2em] text-[rgba(17,17,17,0.3)]">
          TEKKETSU
        </span>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        className="font-mono text-[10px] leading-[14px] tracking-[0.05em] text-[rgba(17,17,17,0.2)] transition-opacity hover:opacity-70"
      >
        Sign out
      </button>
    </div>
  )
}

export { WorkoutTopBar }

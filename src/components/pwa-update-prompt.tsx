import { useRegisterSW } from 'virtual:pwa-register/react'

function PwaUpdatePrompt() {
  const {
    needRefresh: [isUpdateReady, setIsUpdateReady],
    offlineReady: [, setIsOfflineReady],
    updateServiceWorker,
  } = useRegisterSW()

  if (!isUpdateReady) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-6">
      <div className="bg-text-primary text-text-on-dark pointer-events-auto flex w-full max-w-[320px] items-center justify-between gap-4 border border-white/15 px-4 py-3 shadow-[0_12px_28px_rgba(17,17,17,0.18)]">
        <div className="min-w-0">
          <p className="font-mono text-[11px] leading-[16px] tracking-[0.24em]">
            UPDATE READY
          </p>
          <p className="font-body mt-1 text-[14px] leading-[18px] font-normal">
            Reload when you are between sets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsUpdateReady(false)
              setIsOfflineReady(false)
            }}
            className="cursor-pointer border border-white/20 px-3 py-2 font-mono text-[11px] leading-[14px] tracking-[0.18em] text-white/72 transition-opacity hover:opacity-80"
          >
            LATER
          </button>
          <button
            type="button"
            onClick={() => {
              void updateServiceWorker(true)
            }}
            className="bg-bg text-text-primary cursor-pointer px-3 py-2 font-mono text-[11px] leading-[14px] tracking-[0.18em] transition-opacity hover:opacity-88"
          >
            UPDATE
          </button>
        </div>
      </div>
    </div>
  )
}

export { PwaUpdatePrompt }

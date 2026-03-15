import { useAuthActions } from '@convex-dev/auth/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function GoogleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#fafafa"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#fafafa"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#fafafa"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#fafafa"
      />
    </svg>
  )
}

function LandingPage() {
  const { signIn } = useAuthActions()

  return (
    <div className="bg-bg flex h-screen flex-col items-center px-7 pt-14 pb-10">
      {/* Header label */}
      <p className="text-text-muted text-caption font-mono font-medium tracking-[0.25em]">
        WORKOUT TRACKER
      </p>

      {/* Title */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <h1 className="font-display text-text-primary text-[56px] leading-[60px] font-[800] tracking-tight">
          鉄血
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-text-primary h-px w-10" />
          <p className="text-text-primary font-mono text-[13px] leading-[18px] tracking-[0.35em]">
            TEKKETSU
          </p>
          <div className="bg-text-primary h-px w-10" />
        </div>
      </div>

      {/* Hero image */}
      <div className="mt-6 flex min-h-0 w-full flex-1 flex-col items-center justify-center px-3">
        <img
          src="/assets/guts-image-optimized.webp"
          alt="Warrior kneeling with sword"
          className="border-text-primary min-h-0 w-[265px] flex-1 border-2 object-cover"
        />
      </div>

      {/* Tagline */}
      <p className="font-body text-text-secondary mt-6 text-center text-[15px] leading-[24px] font-normal tracking-wide">
        One screen. Sets tracked. Rest timed. No distractions — just you and the
        iron.
      </p>

      {/* Accent line */}
      <div className="bg-accent mt-4 h-0.5 w-6" />

      {/* CTA */}
      <div className="mt-6 flex w-full max-w-[310px] flex-col items-center gap-2.5">
        <button
          onClick={() => signIn('google', { redirectTo: '/workout' })}
          className="bg-text-primary text-text-on-dark flex w-full cursor-pointer items-center justify-center gap-2.5 py-4 font-mono text-[13px] leading-[18px] font-medium tracking-wide transition-opacity hover:opacity-90"
        >
          <GoogleIcon />
          Sign in with Google
        </button>
        <p className="text-text-muted text-caption font-mono tracking-wide">
          Free forever. Let's lock in.
        </p>
      </div>
    </div>
  )
}

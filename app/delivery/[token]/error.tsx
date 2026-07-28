'use client'

import { useEffect } from 'react'

export default function DeliveryError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen items-center justify-center bg-obsidian px-6 font-serif">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/[0.06] p-8 text-center shadow-2xl backdrop-blur-2xl">
        <p className="text-xs tracking-[0.2em] text-white/40 uppercase">
          Obscura delivery
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-white">
          Unable to load delivery
        </h1>
        <p className="mt-3 text-sm text-white/50">
          This delivery page couldn't be loaded. The link may be invalid or
          there was a temporary issue.
        </p>
        <button
          onClick={() => unstable_retry()}
          className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-white/90 active:scale-95"
        >
          Try again
        </button>
      </div>
    </main>
  )
}

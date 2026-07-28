'use client'

import { useEffect } from 'react'

export default function DashboardError({
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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl">
        <p className="text-xs tracking-[0.2em] text-white/40 uppercase">
          Obscura
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-white">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-white/50">
          We couldn't load your dashboard. Please try again.
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

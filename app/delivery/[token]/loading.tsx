export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian font-serif">
      {/* Background shimmer */}
      <div className="absolute inset-0 z-0 animate-pulse bg-white/[0.02]" />

      {/* Image placeholder */}
      <div className="relative z-10 flex h-[70vh] w-full max-w-3xl items-center justify-center px-6">
        <div className="h-full w-full animate-pulse rounded-2xl border border-white/10 bg-white/[0.05]" />
      </div>

      {/* PaywallCard skeleton */}
      <div className="absolute bottom-8 z-20 mx-auto w-full max-w-md px-6 sm:bottom-12">
        <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-2xl">
          {/* Tag */}
          <div className="h-3 w-24 animate-pulse rounded bg-white/[0.05]" />
          {/* Title */}
          <div className="mt-3 h-7 w-44 animate-pulse rounded bg-white/[0.05]" />
          {/* Divider */}
          <div className="my-4 h-px bg-white/10" />
          {/* Price + button row */}
          <div className="flex items-center justify-between gap-4">
            <div className="h-6 w-16 animate-pulse rounded bg-white/[0.05]" />
            <div className="h-10 w-32 animate-pulse rounded-full bg-white/[0.05]" />
          </div>
          {/* Fine print */}
          <div className="mx-auto mt-4 h-2 w-48 animate-pulse rounded bg-white/[0.05]" />
        </div>
      </div>
    </main>
  )
}

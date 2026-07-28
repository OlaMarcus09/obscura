export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      {/* Header skeleton */}
      <header className="mb-10">
        <div className="h-3 w-16 animate-pulse rounded bg-white/[0.05]" />
        <div className="mt-3 h-8 w-48 animate-pulse rounded bg-white/[0.05]" />
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr]">
        {/* Upload dropzone skeleton */}
        <div className="lg:sticky lg:top-12 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="h-4 w-28 animate-pulse rounded bg-white/[0.05]" />
            <div className="mt-4 aspect-[4/3] animate-pulse rounded-xl border border-dashed border-white/10 bg-white/[0.05] sm:aspect-video" />
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="h-10 animate-pulse rounded-lg bg-white/[0.05]" />
              <div className="h-10 animate-pulse rounded-lg bg-white/[0.05]" />
            </div>
            <div className="mt-4 h-11 animate-pulse rounded-full bg-white/[0.05]" />
          </div>
        </div>

        {/* Kanban columns skeleton */}
        <section>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, col) => (
              <div key={col}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-4 w-14 animate-pulse rounded bg-white/[0.05]" />
                  <div className="h-3 w-4 animate-pulse rounded bg-white/[0.05]" />
                </div>
                <div className="flex flex-col gap-3">
                  {Array.from({ length: col === 0 ? 2 : col === 1 ? 3 : 1 }).map(
                    (_, card) => (
                      <div
                        key={card}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="h-4 w-24 animate-pulse rounded bg-white/[0.05]" />
                          <div className="h-4 w-12 animate-pulse rounded bg-white/[0.05]" />
                        </div>
                        <div className="mt-2 h-3 w-16 animate-pulse rounded bg-white/[0.05]" />
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

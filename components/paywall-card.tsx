'use client'

export function PaywallCard({
  title,
  price,
}: {
  title: string
  price: string
}) {
  return (
    <div className="absolute bottom-8 z-20 mx-auto w-full max-w-md px-6 sm:bottom-12">
      <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-2xl">
        {/* Creator tag */}
        <p className="text-xs tracking-[0.2em] text-white/40 uppercase">
          Obscura delivery
        </p>

        {/* Project title */}
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>

        {/* Divider */}
        <div className="my-4 h-px bg-white/10" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-lg font-medium text-white/80">{price}</span>
          <button
            onClick={() => {
              // TODO(stripe): redirect to Stripe Checkout in Phase 4
              alert('Stripe Checkout will be wired in Phase 4.')
            }}
            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-[0_0_24px_rgba(255,255,255,0.15)] active:scale-95"
          >
            Pay to Unlock
          </button>
        </div>

        {/* Fine print */}
        <p className="mt-4 text-center text-[10px] text-white/25">
          Secure payment via Stripe. Instant delivery after payment.
        </p>
      </div>
    </div>
  )
}

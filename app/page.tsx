import Link from 'next/link'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-obsidian">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-white/[0.03] blur-3xl" />

      {/* Hero */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-xs tracking-[0.3em] text-white/30 uppercase">
          Creative delivery, reimagined
        </p>
        <h1 className="mt-4 max-w-2xl font-serif text-5xl font-semibold leading-[1.1] tracking-tight text-white sm:text-7xl">
          Your work, unveiled<br className="hidden sm:block" /> on your terms.
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/50">
          Obscura is a paywall-gated delivery platform for creatives. Upload
          your work, set a price, share a link. Clients pay to unlock.
        </p>

        <div className="mt-10 flex items-center gap-4">
          <Link
            href="/auth/sign-up"
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-[0_0_24px_rgba(255,255,255,0.12)] active:scale-95"
          >
            Get Started
          </Link>
          <Link
            href="/auth/sign-in"
            className="rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="relative z-10 border-t border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px sm:grid-cols-3">
          {[
            {
              title: 'Upload & Obscure',
              desc: 'Drop your work in. It stays blurred and locked until a client pays.',
            },
            {
              title: 'Share a Link',
              desc: 'Every delivery gets a unique link. No accounts needed for your clients.',
            },
            {
              title: 'Get Paid Instantly',
              desc: 'Stripe-powered payments land in your account. No middlemen, no delays.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="border-r border-white/[0.06] px-8 py-12 last:border-r-0"
            >
              <h3 className="text-sm font-medium text-white/80">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/40">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8">
        <p className="text-center font-serif text-sm tracking-wide text-white/20">
          Obscura
        </p>
      </footer>
    </main>
  )
}

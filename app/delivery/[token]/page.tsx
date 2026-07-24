import { notFound } from 'next/navigation'
import { getDeliveryByToken } from '@/lib/queries'
import { PaywallCard } from '@/components/paywall-card'

export const dynamic = 'force-dynamic'

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export default async function DeliveryPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const delivery = await getDeliveryByToken(token)

  if (!delivery) notFound()

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-obsidian font-serif">
      {/* Obscured hero image — 70 % viewport */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={delivery.watermarkedUrl}
          alt=""
          aria-hidden
          className="h-full w-full object-cover blur-2xl brightness-[0.35] saturate-50 scale-110"
        />
        {/* Grain / noise overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%20opacity%3D%220.08%22%2F%3E%3C%2Fsvg%3E')] opacity-40 mix-blend-overlay" />
      </div>

      {/* Visible obscured preview — centred, 70vh */}
      <div className="relative z-10 flex h-[70vh] w-full max-w-3xl items-center justify-center px-6">
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={delivery.watermarkedUrl}
            alt={delivery.projectTitle}
            className="h-full w-full object-cover blur-xl brightness-75 saturate-50"
          />
          {/* Lock icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-16 w-16 text-white/20"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Glassmorphism paywall card */}
      <PaywallCard
        title={delivery.projectTitle}
        price={formatPrice(delivery.price)}
      />
    </main>
  )
}

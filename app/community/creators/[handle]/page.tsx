import { notFound } from 'next/navigation'
import { getCommunityProfile } from '@/lib/community'

export const dynamic = 'force-dynamic'

export default async function CommunityCreatorPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const data = await getCommunityProfile(handle.toLowerCase())
  if (!data) notFound()
  return <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12"><div className="max-w-2xl"><p className="text-xs tracking-[0.2em] text-white/40 uppercase">Creator profile</p><h1 className="mt-2 font-serif text-4xl text-white">{data.profile.displayName}</h1><p className="mt-1 text-sm text-white/40">@{data.profile.handle}</p>{data.profile.bio && <p className="mt-5 text-sm leading-relaxed text-white/60">{data.profile.bio}</p>}</div><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.posts.map((post) => <article key={post.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"><img src={post.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" /><div className="p-4"><h2 className="text-sm font-medium text-white">{post.title}</h2></div></article>)}</div></main>
}

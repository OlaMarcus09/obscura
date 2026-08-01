import Link from 'next/link'
import { getCommunityFeed } from '@/lib/community'

export const dynamic = 'force-dynamic'

export default async function CommunityPage() {
  const posts = await getCommunityFeed()
  return <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
    <div className="flex items-end justify-between gap-4"><div><p className="text-xs tracking-[0.2em] text-white/40 uppercase">The network</p><h1 className="mt-1 font-serif text-4xl text-white">Community</h1><p className="mt-3 max-w-xl text-sm text-white/45">Discover work from the creatives shaping what comes next.</p></div><Link href="/community/new" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black">Share work</Link></div>
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <article key={post.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"><img src={post.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" /><div className="p-5"><h2 className="text-lg font-medium text-white">{post.title}</h2><p className="mt-2 line-clamp-3 text-sm text-white/50">{post.caption}</p>{post.handle && <Link href={`/community/creators/${post.handle}`} className="mt-4 block text-xs text-white/40 hover:text-white">{post.displayName} · @{post.handle}</Link>}</div></article>)}</div>
    {posts.length === 0 && <div className="mt-10 rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-white/40">No showcases yet. Be the first to share your work.</div>}
  </main>
}

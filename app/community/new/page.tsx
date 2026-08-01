import { CreateCommunityForm } from '@/components/create-community-form'

export default function NewCommunityPostPage() {
  return <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12"><p className="text-xs tracking-[0.2em] text-white/40 uppercase">Community</p><h1 className="mt-2 font-serif text-4xl text-white">Share your work</h1><p className="mt-3 text-sm text-white/45">Publish a showcase for other creatives to discover.</p><div className="mt-8"><CreateCommunityForm /></div></main>
}

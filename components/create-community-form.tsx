'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createCommunityPost, type CommunityResult } from '@/app/community/actions'

function Submit() { const { pending } = useFormStatus(); return <button disabled={pending} className="w-full rounded-full bg-white py-3 text-sm font-semibold text-black disabled:opacity-50">{pending ? 'Publishing...' : 'Publish showcase'}</button> }
export function CreateCommunityForm() {
  const [state, action] = useActionState<CommunityResult | null, FormData>(async (_prev, form) => createCommunityPost(form), null)
  return <form action={action} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"><input name="title" required maxLength={200} placeholder="Title" className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-white" /><textarea name="caption" maxLength={5000} placeholder="Tell the community about this work" className="min-h-32 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-white" /><input name="image" required type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm text-white/60" /><Submit />{state?.ok === false && <p className="text-sm text-red-400">{state.error}</p>}{state?.ok && <p className="text-sm text-emerald-300">Published. Your showcase is now in the community.</p>}</form>
}

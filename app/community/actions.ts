'use server'

import { randomUUID } from 'node:crypto'
import { del, put } from '@vercel/blob'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { communityPosts, communityProfiles } from '@/lib/schema'
import { getRequiredUserId } from '@/lib/auth'

export type CommunityResult = { ok: true } | { ok: false; error: string }

function validImage(file: File, bytes: Buffer) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return false
  if (file.type === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
  if (file.type === 'image/jpeg') return bytes.subarray(0, 3).equals(Buffer.from([255,216,255]))
  return bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
}

export async function saveCommunityProfile(formData: FormData): Promise<CommunityResult> {
  const userId = await getRequiredUserId()
  const handle = String(formData.get('handle') ?? '').trim().toLowerCase()
  const displayName = String(formData.get('displayName') ?? '').trim()
  const bio = String(formData.get('bio') ?? '').trim()
  if (!/^[a-z0-9_]{3,30}$/.test(handle)) return { ok: false, error: 'Use 3-30 lowercase letters, numbers, or underscores.' }
  if (!displayName || displayName.length > 100 || bio.length > 1000) return { ok: false, error: 'Check your profile text lengths.' }
  try {
    await db.insert(communityProfiles).values({ userId, handle, displayName, bio: bio || null }).onConflictDoUpdate({ target: communityProfiles.userId, set: { handle, displayName, bio: bio || null, updatedAt: new Date() } })
  } catch { return { ok: false, error: 'That handle may already be in use.' } }
  revalidatePath('/community')
  return { ok: true }
}

export async function createCommunityPost(formData: FormData): Promise<CommunityResult> {
  let userId: string
  try { userId = await getRequiredUserId() } catch (error) { return { ok: false, error: error instanceof Error ? error.message : 'Unable to verify your session.' } }
  const title = String(formData.get('title') ?? '').trim()
  const caption = String(formData.get('caption') ?? '').trim()
  const file = formData.get('image')
  if (!title || title.length > 200 || caption.length > 5000) return { ok: false, error: 'Check your title and caption lengths.' }
  if (!(file instanceof File) || file.size === 0 || file.size > 10 * 1024 * 1024) return { ok: false, error: 'Attach an image up to 10 MB.' }
  const bytes = Buffer.from(await file.arrayBuffer())
  if (!validImage(file, bytes)) return { ok: false, error: 'Only valid JPEG, PNG, or WebP images are supported.' }
  const ext = file.type === 'image/jpeg' ? '.jpg' : file.type === 'image/png' ? '.png' : '.webp'
  let url: string | undefined
  try {
    url = (await put(`community/${randomUUID()}${ext}`, bytes, { access: 'public', contentType: file.type })).url
    await db.insert(communityPosts).values({ creatorId: userId, title, caption: caption || null, imageUrl: url, imageMimeType: file.type, imageSize: file.size })
  } catch (error) {
    if (url) await del(url).catch(() => {})
    console.error('[createCommunityPost] persistence failed:', error)
    return { ok: false, error: 'Could not publish your showcase. Check Blob storage configuration.' }
  }
  revalidatePath('/community')
  return { ok: true }
}

export async function archiveCommunityPost(postId: string): Promise<CommunityResult> {
  const userId = await getRequiredUserId()
  await db.update(communityPosts).set({ status: 'archived', updatedAt: new Date() }).where(and(eq(communityPosts.id, postId), eq(communityPosts.creatorId, userId)))
  revalidatePath('/community')
  return { ok: true }
}

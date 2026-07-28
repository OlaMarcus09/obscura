'use server'

import { randomBytes, randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { put } from '@vercel/blob'
import { db } from '@/lib/db'
import { projects, assets, deliveryLinks } from '@/lib/schema'
import { getCurrentCreatorId } from '@/lib/auth'

export type UploadResult =
  | { ok: true; token: string; title: string }
  | { ok: false; error: string }

/**
 * Handles a creator upload:
 *  1. Persists the file to Vercel Blob storage.
 *  2. Reuses the original URL as the watermark (the "obscured" look is a
 *     CSS/blur effect applied on the paywall page).
 *  3. Creates project + asset + a shareable delivery_link token.
 */
export async function uploadProject(
  _prev: UploadResult | null,
  formData: FormData
): Promise<UploadResult> {
  const creatorId = await getCurrentCreatorId()

  const title = String(formData.get('title') ?? '').trim()
  const priceDollars = Number(formData.get('price'))
  const file = formData.get('file')

  if (!title) return { ok: false, error: 'A project title is required.' }
  if (!Number.isFinite(priceDollars) || priceDollars < 0)
    return { ok: false, error: 'Enter a valid price.' }
  if (!(file instanceof File) || file.size === 0)
    return { ok: false, error: 'Attach a file to deliver.' }
  if (!file.type.startsWith('image/'))
    return { ok: false, error: 'Only image assets are supported for now.' }

  // --- Vercel Blob storage ---
  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = file.name.slice(file.name.lastIndexOf('.')) || '.bin'
  const storedName = `${randomUUID()}${ext}`
  const { url: fileUrl } = await put(storedName, buffer, { access: 'public' })

  const priceCents = Math.round(priceDollars * 100)
  const token = randomBytes(16).toString('hex')

  const [project] = await db
    .insert(projects)
    .values({ creatorId, title, price: priceCents, status: 'active' })
    .returning({ id: projects.id })

  await db.insert(assets).values({
    projectId: project.id,
    originalUrl: fileUrl,
    // MOCK watermark: same asset; obscuring is a UI effect on the paywall.
    watermarkedUrl: fileUrl,
    mimeType: file.type,
    size: file.size,
  })

  await db.insert(deliveryLinks).values({ projectId: project.id, token })

  revalidatePath('/dashboard')
  return { ok: true, token, title }
}

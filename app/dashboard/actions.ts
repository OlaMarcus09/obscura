'use server'

import { randomBytes, randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { del, put } from '@vercel/blob'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { projects, assets, deliveryLinks } from '@/lib/schema'
import { getCurrentCreatorId } from '@/lib/auth'

export type UploadResult =
  | { ok: true; token: string; title: string }
  | { ok: false; error: string }

/**
 * Handles a creator upload:
 *  1. Persists the file to Vercel Blob storage.
 *  2. Keeps the original private. A public preview must be a separate,
 *     irreversible derivative before it can be shown on the paywall.
 *  3. Creates project + asset + a shareable delivery_link token.
 */
export async function uploadProject(
  _prev: UploadResult | null,
  formData: FormData
): Promise<UploadResult> {
  let creatorId: string
  try { creatorId = await getCurrentCreatorId() } catch (error) { return { ok: false, error: error instanceof Error ? error.message : 'Unable to verify your session.' } }

  const title = String(formData.get('title') ?? '').trim()
  const priceDollars = Number(formData.get('price'))
  const file = formData.get('file')

  if (!title) return { ok: false, error: 'A project title is required.' }
  if (title.length > 200) return { ok: false, error: 'Project title is too long.' }
  if (!Number.isFinite(priceDollars) || priceDollars < 0 || priceDollars > 1000000)
    return { ok: false, error: 'Enter a valid price.' }
  if (!(file instanceof File) || file.size === 0)
    return { ok: false, error: 'Attach a file to deliver.' }
  if (file.size > 10 * 1024 * 1024)
    return { ok: false, error: 'Images must be 10 MB or smaller.' }
  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
  if (!allowedTypes.has(file.type))
    return { ok: false, error: 'Only JPEG, PNG, and WebP images are supported.' }

  // --- Vercel Blob storage ---
  const buffer = Buffer.from(await file.arrayBuffer())
  const isPng =
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const isJpeg =
    buffer.length >= 3 &&
    buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
  const isWebp =
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  if (
    (file.type === 'image/png' && !isPng) ||
    (file.type === 'image/jpeg' && !isJpeg) ||
    (file.type === 'image/webp' && !isWebp)
  )
    return { ok: false, error: 'The uploaded file does not match its image type.' }
  const extByType: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  }
  const ext = extByType[file.type]
  const storedName = `${randomUUID()}${ext}`
  // Originals must never be publicly addressable. Paid delivery will proxy them
  // through an authorization-checked route.
  const priceCents = Math.round(priceDollars * 100)
  const token = randomBytes(16).toString('hex')

  let fileUrl: string | null = null
  let projectId: string | null = null
  try {
    const blob = await put(storedName, buffer, {
      access: 'private',
      contentType: file.type,
    })
    fileUrl = blob.url

    const [project] = await db
      .insert(projects)
      .values({ creatorId, title, price: priceCents, status: 'active' })
      .returning({ id: projects.id })
    projectId = project.id

    await db.insert(assets).values({
      projectId,
      originalUrl: fileUrl,
      // Do not reuse the original URL as a "watermark"; CSS blur is reversible.
      watermarkedUrl: null,
      mimeType: file.type,
      size: file.size,
    })

    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    await db.insert(deliveryLinks).values({ projectId, token, expiresAt })
  } catch (error) {
    // Neon HTTP has no transaction support, so compensate in reverse order.
    if (projectId) {
      await db.delete(deliveryLinks).where(eq(deliveryLinks.projectId, projectId)).catch(() => {})
      await db.delete(assets).where(eq(assets.projectId, projectId)).catch(() => {})
      await db.delete(projects).where(eq(projects.id, projectId)).catch(() => {})
    }
    if (fileUrl) await del(fileUrl).catch(() => {})
    console.error('[uploadProject] persistence failed:', error)
    return { ok: false, error: 'Could not create this delivery. Please try again.' }
  }

  revalidatePath('/dashboard')
  return { ok: true, token, title }
}

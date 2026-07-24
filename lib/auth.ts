import 'server-only'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'

/**
 * Returns the authenticated creator's `public.users` ID.
 *
 * On first sign-in the Neon Auth user won't have a corresponding row in
 * `public.users`, so we upsert one.
 */
export async function getCurrentCreatorId(): Promise<string> {
  const { data: session } = await auth.getSession()

  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const neonUserId = session.user.id

  // Ensure a public.users row exists for this Neon Auth user
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, neonUserId))
    .limit(1)

  if (existing.length === 0) {
    await db.insert(users).values({ id: neonUserId, role: 'creator' })
  }

  return neonUserId
}

/**
 * Returns session info for display (name, email) or null if not signed in.
 */
export async function getSessionUser() {
  const { data: session } = await auth.getSession()
  if (!session?.user) return null
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  }
}

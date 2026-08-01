import 'server-only'

import { redirect, unstable_rethrow } from 'next/navigation'
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
  let session
  try {
    const result = await auth.getSession()
    session = result.data
  } catch (err) {
    unstable_rethrow(err)
    console.error('[getCurrentCreatorId] auth.getSession() threw:', err)
    redirect('/auth/sign-in')
  }

  if (!session?.user) {
    redirect('/auth/sign-in')
  }

  const neonUserId = session.user.id

  // Ensure a public.users row exists for this Neon Auth user
  try {
    const existing = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, neonUserId))
      .limit(1)

    if (existing.length === 0) {
      await db
        .insert(users)
        .values({ id: neonUserId, role: 'creator' })
        .onConflictDoNothing({ target: users.id })
    }

    const profile = existing[0] ?? (await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, neonUserId))
      .limit(1))[0]
    if (profile?.role !== 'creator') {
      throw new Error('Creator access required.')
    }
  } catch (err) {
    console.error('[getCurrentCreatorId] DB upsert failed:', err)
    throw new Error('Failed to initialize creator profile.')
  }

  return neonUserId
}

export async function getRequiredUserId(): Promise<string> {
  let session
  try {
    const result = await auth.getSession()
    session = result.data
  } catch (err) {
    // Request-time APIs throw framework signals during static prerendering.
    // They must be returned to Next.js so it can switch this route to dynamic.
    unstable_rethrow(err)
    throw new Error('Unable to verify your session.')
  }
  if (!session?.user) redirect('/auth/sign-in')
  return session.user.id
}

/**
 * Returns session info for display (name, email) or null if not signed in.
 */
export async function getSessionUser() {
  try {
    const { data: session } = await auth.getSession()
    if (!session?.user) return null
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    }
  } catch (err) {
    unstable_rethrow(err)
    return null
  }
}

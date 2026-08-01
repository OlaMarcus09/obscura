import 'server-only'

import { desc, eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { communityPosts, communityProfiles } from '@/lib/schema'

export async function getCommunityFeed() {
  return db.select({
    id: communityPosts.id,
    title: communityPosts.title,
    caption: communityPosts.caption,
    imageUrl: communityPosts.imageUrl,
    createdAt: communityPosts.createdAt,
    creatorId: communityPosts.creatorId,
    handle: communityProfiles.handle,
    displayName: communityProfiles.displayName,
  }).from(communityPosts)
    .leftJoin(communityProfiles, eq(communityProfiles.userId, communityPosts.creatorId))
    .where(eq(communityPosts.status, 'published'))
    .orderBy(desc(communityPosts.createdAt), desc(communityPosts.id)).limit(20)
}

export async function getCommunityProfile(handle: string) {
  const [profile] = await db.select().from(communityProfiles).where(eq(communityProfiles.handle, handle)).limit(1)
  if (!profile) return null
  const posts = await db.select({ id: communityPosts.id, title: communityPosts.title, caption: communityPosts.caption, imageUrl: communityPosts.imageUrl, createdAt: communityPosts.createdAt })
    .from(communityPosts).where(and(eq(communityPosts.creatorId, profile.userId), eq(communityPosts.status, 'published')))
    .orderBy(desc(communityPosts.createdAt)).limit(50)
  return { profile, posts }
}

import { eq, desc } from 'drizzle-orm'
import { db } from './db'
import { projects, assets, deliveryLinks, users } from './schema'

export type CreatorProject = {
  id: string
  title: string
  price: number
  status: 'draft' | 'active' | 'archived'
  assetCount: number
  deliveryToken: string | null
}

export async function getProjectsForCreator(
  creatorId: string
): Promise<CreatorProject[]> {
  const rows = await db
    .select({
      id: projects.id,
      title: projects.title,
      price: projects.price,
      status: projects.status,
      assetId: assets.id,
      deliveryToken: deliveryLinks.token,
    })
    .from(projects)
    .leftJoin(assets, eq(assets.projectId, projects.id))
    .leftJoin(deliveryLinks, eq(deliveryLinks.projectId, projects.id))
    .where(eq(projects.creatorId, creatorId))
    .orderBy(desc(projects.id))

  const byId = new Map<string, CreatorProject>()
  for (const row of rows) {
    let project = byId.get(row.id)
    if (!project) {
      project = {
        id: row.id,
        title: row.title,
        price: row.price,
        status: row.status,
        assetCount: 0,
        deliveryToken: row.deliveryToken,
      }
      byId.set(row.id, project)
    }
    if (row.assetId) project.assetCount += 1
    if (row.deliveryToken) project.deliveryToken = row.deliveryToken
  }
  return [...byId.values()]
}

export type DeliveryPageData = {
  projectTitle: string
  price: number
  creatorRole: string
  watermarkedUrl: string
  originalUrl: string
  assetMimeType: string
}

export async function getDeliveryByToken(
  token: string
): Promise<DeliveryPageData | null> {
  const rows = await db
    .select({
      projectTitle: projects.title,
      price: projects.price,
      creatorRole: users.role,
      watermarkedUrl: assets.watermarkedUrl,
      originalUrl: assets.originalUrl,
      assetMimeType: assets.mimeType,
    })
    .from(deliveryLinks)
    .innerJoin(projects, eq(projects.id, deliveryLinks.projectId))
    .innerJoin(users, eq(users.id, projects.creatorId))
    .innerJoin(assets, eq(assets.projectId, projects.id))
    .where(eq(deliveryLinks.token, token))
    .limit(1)

  if (rows.length === 0) return null

  const row = rows[0]
  return {
    projectTitle: row.projectTitle,
    price: row.price,
    creatorRole: row.creatorRole,
    watermarkedUrl: row.watermarkedUrl ?? row.originalUrl,
    originalUrl: row.originalUrl,
    assetMimeType: row.assetMimeType,
  }
}

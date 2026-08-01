import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  stripeAccountId: text('stripe_account_id'),
  role: text('role', { enum: ['creator', 'client'] }).notNull().default('creator'),
})

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  creatorId: uuid('creator_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  price: integer('price').notNull(),
  status: text('status', { enum: ['draft', 'active', 'archived'] }).notNull().default('draft'),
})

export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  originalUrl: text('original_url').notNull(),
  watermarkedUrl: text('watermarked_url'),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
})

export const deliveryLinks = pgTable('delivery_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
})

export const accessLogs = pgTable('access_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  viewerEmail: text('viewer_email'),
  ip: text('ip'),
  paymentIntentId: text('payment_intent_id'),
  downloadedAt: timestamp('downloaded_at', { withTimezone: true }).defaultNow(),
  paid: boolean('paid').notNull().default(false),
})

export const communityProfiles = pgTable('community_profiles', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  handle: text('handle').notNull().unique(),
  displayName: text('display_name').notNull(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  websiteUrl: text('website_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const communityPosts = pgTable('community_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  creatorId: uuid('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  caption: text('caption'),
  imageUrl: text('image_url').notNull(),
  imageMimeType: text('image_mime_type').notNull(),
  imageSize: integer('image_size').notNull(),
  tags: text('tags').array().notNull().default([]),
  status: text('status', { enum: ['published', 'archived'] }).notNull().default('published'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  feedIndex: index('community_posts_feed_idx').on(table.status, table.createdAt),
  creatorIndex: index('community_posts_creator_idx').on(table.creatorId, table.createdAt),
}))

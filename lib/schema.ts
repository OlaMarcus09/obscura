import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
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

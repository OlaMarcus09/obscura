CREATE TABLE IF NOT EXISTS "community_profiles" (
  "user_id" uuid PRIMARY KEY NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "handle" text NOT NULL UNIQUE CHECK (handle ~ '^[a-z0-9_]{3,30}$'),
  "display_name" text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 100),
  "bio" text CHECK (bio IS NULL OR char_length(bio) <= 1000),
  "avatar_url" text,
  "website_url" text,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "community_posts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "creator_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "title" text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  "caption" text CHECK (caption IS NULL OR char_length(caption) <= 5000),
  "image_url" text NOT NULL,
  "image_mime_type" text NOT NULL CHECK (image_mime_type IN ('image/jpeg', 'image/png', 'image/webp')),
  "image_size" integer NOT NULL CHECK (image_size > 0 AND image_size <= 10485760),
  "tags" text[] NOT NULL DEFAULT '{}',
  "status" text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'archived')),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "community_posts_feed_idx" ON "community_posts" ("status", "created_at" DESC);
CREATE INDEX IF NOT EXISTS "community_posts_creator_idx" ON "community_posts" ("creator_id", "created_at" DESC);

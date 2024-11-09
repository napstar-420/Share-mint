import { db } from '@/app/db/connection'
import {
  pgTable,
  varchar,
  timestamp,
  pgEnum,
  integer,
  index,
  text,
  json,
} from 'drizzle-orm/pg-core'
import { users } from '@/app/db/schema'
import { eq } from 'drizzle-orm'

export const ImageTypeEnum = pgEnum('file_type', [
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/png',
  'image/gif',
  'image/heic',
  'image/ico',
  'image/bmp',
])

export const images = pgTable(
  'images',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    file_name: varchar('file_name', { length: 255 }).notNull(),
    file_type: ImageTypeEnum(),
    file_size: integer('file_size').notNull(),
    drive_id: varchar('drive_id').notNull(),
    upload_date: timestamp('upload_date').defaultNow().notNull(),
    share_link: varchar('share_link', { length: 255 }).notNull().unique(),
    uploader_ip: varchar('uploader_ip', { length: 50 }),
    uploader_id: text('uploader_id').references(() => users.id),
    metadata: json().default({}),
  },
  (table) => {
    return {
      shareLinkIdx: index('share_link_idx').on(table.share_link),
      uploaderIdIdx: index('uploader_id_idx').on(table.uploader_id),
    }
  },
)

// QUERIES

export type NewImage = typeof images.$inferInsert
export type ImageSelectFields = (typeof images)['_']['columns']

export async function insertImage(image: NewImage) {
  return await db.insert(images).values(image).returning()
}

export async function getImageByLink(
  link: string,
  projection?: Partial<ImageSelectFields>,
) {
  return db
    .select(projection!)
    .from(images)
    .where(eq(images.share_link, link))
    .limit(1)
}

export async function isLinkExists(link: string) {
  const result = await getImageByLink(link, { id: images.id })
  return Boolean(result.length)
}

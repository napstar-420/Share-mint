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
import { CONFIG } from '@/app/config'

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
    uploader_id: text('uploader_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
    metadata: json().default({}),
    downloads_left: integer('downloads_left'),
    expiration_time: timestamp('expiration_time', { mode: 'date' }),
    password: varchar('password', { length: CONFIG.PASSWORD_MAX_LENGTH }),
  },
  (table) => {
    return {
      shareLinkIdx: index('share_link_idx').on(table.share_link),
      uploaderIdIdx: index('uploader_id_idx').on(table.uploader_id),
    }
  },
)

export type NewImage = typeof images.$inferInsert
export type ImageSelectFields = (typeof images)['_']['columns']
export type Image = typeof images.$inferSelect

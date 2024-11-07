import {
  pgTable,
  varchar,
  timestamp,
  pgEnum,
  integer,
  index,
  text,
  primaryKey,
  json,
} from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
})

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

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
    upload_date: timestamp('upload_date').defaultNow().notNull(),
    share_link: varchar('share_link', { length: 255 }).notNull().unique(),
    uploader_ip: varchar('uploader_ip', { length: 50 }),
    uploader_id: text('uploader_id').references(() => users.id),
    metadata: json().default({}),
  },
  (table) => {
    return {
      shareLinkIdx: index('share_link_idx').on(table.file_name),
      uploaderIdIdx: index('uploader_id_idx').on(table.uploader_ip),
    }
  },
)

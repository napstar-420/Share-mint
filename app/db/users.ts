import { UserRoles } from '@/enums'
import { pgTable, timestamp, text, pgEnum } from 'drizzle-orm/pg-core'

export const UserRoleEnum = pgEnum('user_role', [
  UserRoles.USER,
  UserRoles.ADMIN,
])

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: UserRoleEnum().default(UserRoles.USER),
})

export type User = typeof users.$inferSelect
